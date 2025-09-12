{
  description = "orbtronic l1 software engineer";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells = {
          default = pkgs.mkShell {
            packages = with pkgs; [
              black
              checkmake
              dockfmt
              isort
              nixfmt-rfc-style
              opentofu
              prettier

              poetry
              python313

              bun

              awscli2
              mongosh
              openapi-tui
              terraform
              treefmt
            ];
          };
        };
      }
    );
}
