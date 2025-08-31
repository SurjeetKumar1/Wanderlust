# **Backend CI/CD Pipeline: AWS EC2 & GitHub Actions 🚀**

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/All-listings.png" alt="Application Screenshot" width="75%"/>
</p>

This repository contains the complete setup for an automated **CI/CD** (Continuous Integration/Continuous Deployment) pipeline for a Node.js backend. The pipeline uses **GitHub Actions** to automatically deploy the latest changes from the `main` branch to an **AWS EC2 instance**. The application is managed by **PM2** to ensure it's always running, and **Nginx** serves as a reverse proxy.

---

## **Table of Contents**

- [Features](#features-)
- [Architecture Overview](#architecture-overview-)
- [Setup Instructions](#setup-instructions-)
  - [1. AWS EC2 Instance Setup](#1-aws-ec2-instance-setup-)
  - [2. GitHub Actions Self-Hosted Runner](#2-github-actions-self-hosted-runner-setup-)
  - [3. GitHub Actions Workflow](#3-github-actions-workflow-configuration-)
  - [4. Nginx Reverse Proxy Setup](#4-nginx-reverse-proxy-setup-)
- [Verification](#verification-)
- [Technology Stack](#technology-stack-)

---

## **Features ✨**

- **Automated Deployments:** Every push to the `main` branch automatically triggers a new deployment.
- **Zero Downtime:** PM2 ensures the application is always running, even if it crashes or the server reboots.
- **Robust & Scalable:** Built on AWS EC2, providing a reliable and scalable hosting environment.
- **Clean URLs:** Nginx acts as a reverse proxy, allowing access to the app on the standard port 80.
- **Secure:** Uses SSH keys for server access and a self-hosted runner for secure communication between GitHub and AWS.

---

## **Architecture Overview 🏗️**

The pipeline follows these steps:
1.  A developer pushes code to the `main` branch on GitHub.
2.  The push event triggers a GitHub Actions workflow.
3.  GitHub Actions assigns the job to a self-hosted runner configured on the AWS EC2 instance.
4.  The runner on the EC2 instance checks out the latest code, installs dependencies, and builds the application.
5.  PM2 restarts the Node.js application with the new code.
6.  Nginx forwards incoming traffic from the public internet (port 80) to the Node.js application running on port 8080.



---

## **Setup Instructions 🛠️**

Follow these steps to replicate the setup.

### **1. AWS EC2 Instance Setup ☁️**

First, create and configure the cloud server.

1.  **Launch Instance:**
    -   In the AWS EC2 console, launch a new instance.
    -   **AMI:** `Ubuntu`
    -   **Instance Type:** `t2.micro` (Free Tier eligible)
2.  **Key Pair:** Create a new `.pem` key pair and download it.
3.  **Security Group (Firewall):** Configure inbound rules to allow:
    -   `SSH` (Port 22) from your IP.
    -   `HTTP` (Port 80) from `Anywhere` (0.0.0.0/0).
    -   `Custom TCP` (Port 8080) from `Anywhere` (0.0.0.0/0).
4.  **Connect and Prepare:**
    -   Secure your key: `   chmod 400 "wanderlust-key.pem""`
    -   SSH into your instance: `ssh -i "wanderlust-key.pem" ubuntu@ec2-100-26-197-29.compute-1.amazonaws.com`
    -   Install necessary software:
        ```bash
        sudo apt update
        sudo apt install -y nodejs npm nginx
        sudo npm install -g pm2
        ```
   <br><br>

![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/ec2-machine.png)
<br><br>

   <br><br>

![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/Enable-port.png)
<br><br>


### **2. GitHub Actions Self-Hosted Runner Setup 🏃‍♂️**

Connect your EC2 instance to your GitHub repository.

1.  In your GitHub repo, go to **Settings > Actions > Runners**.
2.  Click **"New self-hosted runner"** and select **Linux**.
3.  Follow the provided commands on your EC2 instance to download, configure, and run the runner as a service.

    ```bash
    # Download
    mkdir backend-runner && cd backend-runner
      curl -o actions-runner-linux-x64-2.328.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
      echo "01066fad3a2893e63e6ca880ae3a1fad5bf9329d60e77ee15f2b97c148c3cd4e  actions-runner-linux-x64-2.328.0.tar.gz" | shasum -a 256 -c
      tar xzf ./actions-runner-linux-x64-2.328.0.tar.gz
    
    # Configure
    ./config.sh --url https://github.com/SurjeetKumar1/Wanderlust --token <...........>

    # Install and start the service
    sudo ./svc.sh install
    sudo ./svc.sh start
    ```

### **3. GitHub Actions Workflow Configuration ⚙️**

Create the automated deployment script.

1.  In your repository, create the file `.github/workflows/cicd.yml`.
2.  Paste the following configuration:

    ```yaml
    name: Backend CI/CD Pipeline

    on:
      push:
        branches: [ "main" ]

    jobs:
      deploy:
        runs-on: self-hosted

        steps:
        - name: Backup existing .env file
          run: |
            if [ -f .env ]; then
              mv .env ../.env.backup
            fi
        
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Restore .env file
          run: |
            if [ -f ../.env.backup ]; then
              mv ../.env.backup .env
            fi

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20' # Specify your Node.js version
            cache: 'npm'

        - name: Install Dependencies
          run: npm ci

        - name: Build Application
          run: npm run build --if-present
        
        - name: Restart Application with PM2
          run: |
            pm2 restart backend || pm2 start app.js --name backend
            pm2 save
    ```

       <br><br>

![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/cicd-build.png)
<br><br>

### **4. Nginx Reverse Proxy Setup 🌐**

Make your application accessible on port 80.

1.  Create a new Nginx configuration file:
    ```bash
    sudo nano /etc/nginx/sites-available/wanderlust-app
    ```
2.  Add the following server block to proxy requests:
    ```nginx
    server {
        listen 80;
        server_name _; # Listens for any domain/IP

        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Enable the new site and restart Nginx:
    ```bash
    sudo ln -s /etc/nginx/sites-available/wanderlust-app /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo systemctl restart nginx
    ```

---

### **4. Commands runs on EC2 server through our terminal 🌐**
   <br><br>

![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/commands.png)
<br><br>

## **Verification ✅**

After pushing a change to the `main` branch, the GitHub Action will automatically trigger. You can verify a successful deployment by accessing your EC2 instance's public IP address or domain name in a browser.

**Example Endpoint:** `http://ec2-100-26-197-29.compute-1.amazonaws.com/listings`

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/signup.png" alt="Sign Up Page" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/map.png" alt="Map View" width="48%"/>
</p>
<br>
<br>

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/individual-listing.png" alt="Sign Up Page" width="48%"/>
  <img src="https://github.com/SurjeetKumar1/Wanderlust/blob/main/public/assets/new-listings.png" alt="Map View" width="48%"/>
</p>



---

## **Technology Stack 💻**

- **Cloud Provider:** [Amazon Web Services (AWS)](https://aws.amazon.com/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Compute:** [AWS EC2](https://aws.amazon.com/ec2/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Process Manager:** [PM2](https://pm2.keymetrics.io/)
- **Web Server / Reverse Proxy:** [Nginx](https://www.nginx.com/)
- **Operating System:** [Ubuntu](https://ubuntu.com/)

---
