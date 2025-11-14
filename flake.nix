{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";

    # nixpkgs-playwright.url = "github:NixOS/nixpkgs/979daf34c8cacebcd917d540070b52a3c2b9b16e";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    {
      nixpkgs,
      devenv,
      systems,
      ...
    }@inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      # packages = forEachSystem (
      #   system:
      #   let
      #     pkgs = nixpkgs.legacyPackages.${system};
      #   in
      #   {
      #   }
      # );

      devShells = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          # pkgs-playwright = import inputs.nixpkgs-playwright { system = pkgs.stdenv.system; };
          # browsers =
          #   (builtins.fromJSON (builtins.readFile "${pkgs.playwright-driver}/browsers.json")).browsers;
          # chromium-rev = (builtins.head (builtins.filter (x: x.name == "chromium") browsers)).revision;
          playwright-version = "1.56.1";
          playwright-port = "3010";
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {
                packages = with pkgs; [
                  # Language servers
                  nodePackages.typescript-language-server
                  vue-language-server
                  yaml-language-server

                  # Tools
                  gh
                  # nodePackages.prettier
                  turbo
                  act
                  npm-check

                  # Required for browser testing
                  # playwright-driver.browsers
                ];

                # env.PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
                # env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
                # env.PLAYWRIGHT_NODEJS_PATH = "${pkgs.nodejs}/bin/node";
                # env.PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs.playwright.browsers}/chromium-${chromium-rev}/chrome-linux/chrome";
                env.PW_TEST_CONNECT_WS_ENDPOINT = "ws://127.0.0.1:${playwright-port}/";

                languages.javascript = {
                  enable = true;
                  npm.enable = true;
                  yarn.enable = true;
                };

                languages.typescript.enable = true;

                git-hooks.hooks = {
                  eslint.enable = true;
                  prettier = {
                    enable = true;
                    settings.configPath = ".prettierrc";
                  };
                  nixfmt-rfc-style.enable = true;
                };

                scripts = {
                  playwright-server.exec = ''
                    docker run -p ${playwright-port}:${playwright-port} \
                     --rm --init -it \
                     --workdir /home/pwuser \
                     mcr.microsoft.com/playwright:v${playwright-version}-noble \
                     /bin/sh -c \
                     "npx -y playwright@${playwright-version} run-server --port ${playwright-port} --host 0.0.0.0"
                  '';
                };
              }
            ];
          };
        }
      );
    };
}
