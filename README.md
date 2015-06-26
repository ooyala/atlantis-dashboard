# Atlantis UI - UI interface for Atlantis

## Getting Started

### Setup developement environment:
1. Git clone repo:

        git clone https://github.com/budhrg/atlantis-dashboard

2. Run it as:

        go run api_server.go

3. Open following url in browser:

        http://localhost:5001/public/#/dashboard

### Run with nginx:
1. Git clone repo:

        git clone https://github.com/budhrg/atlantis-dashboard

2. Update `nginx.conf` file for following values:

     - `user __USERNAME__` :- Update with your username
     - `__PATH_TO_DIRECTORY__` :- Directory path of this repo
     - `__MANAGER_HOSTNAME__` :- Manager address with `hostname:port`

3. Run command:

        sudo nginx -c __PATH_TO_DIRECTORY__/nginx.conf

4. Open following url in browser:

        http://localhost:5001/public/#/dashboard
