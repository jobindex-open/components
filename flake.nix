{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
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
      devShells = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
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
                  turbo
                  act
                  npm-check
                ];

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
                    settings = {
                      binPath = "./node_modules/.bin/prettier";
                      configPath = "./.prettierrc";
                    };
                  };
                  nixfmt-rfc-style.enable = true;
                };

                env.PW_TEST_CONNECT_WS_ENDPOINT = "ws://127.0.0.1:${playwright-port}/";

                scripts = {
                  # Run playwright browsers in a docker container
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
