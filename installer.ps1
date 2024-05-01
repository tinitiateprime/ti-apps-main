# Check if Node.js is installed
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Installing Node.js..."
    choco install nodejs -y
}

# Initialize a Node.js project
npm init -y

# Define the modules to be installed
$modules = @("express", "markdown-it", "clipboardy", "aws-sdk", "express-session", "dotenv", "axios","turndown")

# Iterate over each module and install it if it's not already installed
foreach ($module in $modules) {
    # Check if the module is already installed
    $modulePath = Join-Path "node_modules" $module
    if (Test-Path $modulePath) {
        Write-Host "$module is already installed."
    } else {
        # Install the module
        npm install $module
    }
}
