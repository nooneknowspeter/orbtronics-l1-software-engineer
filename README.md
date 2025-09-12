# L1 Software Engineer Technical Design Round

[Technical Design Round Information](./docs/L1-Software-Engineer-Technical-Design-Round-Challenge_05_09_2025.pdf)

## Setup

### Docker Compose

> [!NOTE]
>
> A [`Makefile`](./Makefile) is available with quick commands
> for using `docker compose`.

Create a `.env` in the project directory.

```env
# example docker compose .env
ACCESS_TOKEN_EXPIRES_MINUTES=60
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:4173
JWT_ALGORITHM=algorithm
JWT_SECRET=secret
ME_CONFIG_BASICAUTH_PASSWORD=interview
ME_CONFIG_BASICAUTH_USERNAME=orbtronics
MONGO_DATABASE_NAME=minitasks
MONGO_INITDB_ROOT_PASSWORD=interview
MONGO_INITDB_ROOT_USERNAME=orbtronics
```

#### Dev

The command below builds local images using `Dockerfile` contexts from
`./backend/` and `./frontend/`:

```sh
docker compose up
```

#### Production

The command below pulls the images from the projects
[packages registry](https://github.com/nooneknowspeter?tab=packages&repo_name=orbtronics-l1-software-engineer):

```sh
docker compose -f compose.prod.yaml up
```

### Manually

#### Dependencies

Ensure the following dependencies are installed:

- Bun `1.2.21`
- Poetry `2.1.4`
- Python `3.13`

> [!NOTE]
>
> A flake devShell is defined in a [`flake.nix`](./flake.nix)
> that provides all required dependencies with the correct versions.
>
> Ensure that Nix [experimental-features](https://nixos.wiki/wiki/Flakes)
> are enabled.
>
> For [`direnv`](https://github.com/direnv/direnv) users,
> a [`.envrc`](./.envrc) is provided.
>
> To enter the devShell manually:
>
> ```sh
> nix develop
> ```
