# L1 Software Engineer Technical Design Round

[Technical Design Round Information](./docs/L1-Software-Engineer-Technical-Design-Round-Challenge_05_09_2025.pdf)

[Frontend Live](http://ec2-18-210-134-224.compute-1.amazonaws.com:3000/)

[API Live](http://ec2-18-210-134-224.compute-1.amazonaws.com:8000/)

> [!NOTE]
>
> An [`api.yaml`](./backend/api.yaml) is available.
> It describes the api and it's endpoints using the [OpenAPI Specification](https://swagger.io/specification/).
> It can also be used in api-clients; Postman, Posting, OpenAPI TUI, ...

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

#### Backend

> [!NOTE]
>
> A port forwarded MongoDB instance must be available.
>
> A database service can be ran with the dev `compose.yaml` using
> `docker compose run database`. However the backend service is dependent on it.
>
> The backend can be stopped with `docker compose stop backend`.

Create a `.env` in the `./backend` directory.

```env
FRONTEND_URL=http://localhost:3000
JWT_SECRET=secret
JWT_ALGORITHM=algorithm
ACCESS_TOKEN_EXPIRES_MINUTES=60
MONGO_INITDB_ROOT_USERNAME=orbtronics
MONGO_INITDB_ROOT_PASSWORD=interview
MONGO_DATABASE_NAME=minitasks
MONGO_CONNECTION_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017
```

Install dependencies:

```sh
poetry install
```

Then run the server:

> [!NOTE]
>
> A [`Makefile`](./backend/Makefile) is available.

```sh
# development server
poetry run fastapi dev ./src/orbtronics_l1_software_engineer_backend/main.py
```

```sh
# production server
poetry run fastapi run ./src/orbtronics_l1_software_engineer_backend/main.py
```

#### Frontend

Create a `.env.development` and/or a `.env.production` in `./frontend/`.

```env
BACKEND_URL=http://localhost:8000
```

##### Dev

```sh
bun dev
```

##### Production

```sh
bun run build
bun run start
```

### AWS + Terraform

> [!NOTE]
>
> Ensure that the AWS CLI is installed and configured

Create a `terraform.tfvars` in `./infrastructure/`

```terraform
# example terraform.tfvars
access_token_expires_minutes=60
aws_instance_ami="ami-0360c520857e3138f"
aws_key_pair_algorithm="RSA || ED25519"
aws_key_pair_name="key-name"
jwt_algorithm="algorithm"
jwt_secret="secret"
me_config_basicauth_password="password"
me_config_basicauth_username="username"
mongo_database_name="database"
mongo_initdb_root_password="password"
mongo_initdb_root_username="username"
```

Then plan and apply as usual.

```sh
terraform plan
terraform apply
```

> [!NOTE]
>
> The created instance can be access through `ssh`.
>
> Save a `private-key.pem` from the `terraform output`.
> Follow this [script](./infrastructure/scripts/extract-pem-key.sh) for reference
>
> Then `ssh` into the instance using
> `ssh -i private-key.pem ubuntu@instance_elastic_public_ip`

> [!NOTE]
>
> The instance needs some time to execute the [user data script](./infrastructure/instance.tf.
> If it fails, the commands need to be ran manually through `ssh`.

## Solutions Architecture

#### Diagram Showing Application Architecture

```mermaid
graph TD
    User[User Browser]
    Frontend[Frontend - Next.js]
    Backend[Backend - FastAPI]
    Database[(MongoDB)]

    User --HTTPS--> Frontend
    Frontend --JWT Cookie Fetch--> Backend
    Backend --CRUD--> Database
```

#### Diagram Showing Infrastructure

```mermaid

graph TB

    Internet[Internet]
    Internet -->|Inbound traffic| InternetGateway
    InternetGateway -->|Outbound traffic| Internet

    subgraph VPC[VPC]
        InternetGateway[Internet Gateway]
        RouteTable[Route Table\n0.0.0.0/0]

        Subnet[Subnet]
        Firewall[Security Group]
        EC2[EC2 Instance]

        InternetGateway --> RouteTable
        RouteTable --> Subnet
        Subnet --> Firewall
        Firewall --> EC2

        EC2 --> Firewall
        Firewall --> Subnet
        Subnet --> RouteTable
        RouteTable --> InternetGateway
    end

```

#### Diagram Showing Database Schema

```mermaid
erDiagram
    USERS {
        string _id PK
        string username UK
        string email UK
        string hashed_password
        string created_at
        string updated_at
    }

    TASKS {
        string _id PK
        string user_id FK
        string title
        string description
        string priority
        string status
        string due_date
        string created_at
        string updated_at
    }

    USERS ||--o{ TASKS : ""
```
