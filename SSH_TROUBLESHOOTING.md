# SSH Authentication Troubleshooting Guide

## Current Error:

```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

## Step-by-Step Fix:

### 1. Verify Your SSH Key Format

Run this command to check your private key:

```bash
cat ~/.ssh/id_ed25519
```

**Expected format:**

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAFwAAAAdzc2gtZW
QyNTUxOQAAACAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
... (multiple lines)
AAAABmJheWFqaWQBAgMEBQ==
-----END OPENSSH PRIVATE KEY-----
```

### 2. If Your Key Has Different Format

If your key shows `-----BEGIN PRIVATE KEY-----` instead, convert it:

```bash
# Convert to OpenSSH format
ssh-keygen -p -m OpenSSH -f ~/.ssh/id_ed25519
```

### 3. Generate New SSH Key (if needed)

If the key is corrupted or wrong format:

```bash
# Generate new Ed25519 key
ssh-keygen -t ed25519 -C "github-actions@your-email.com" -f ~/.ssh/github_actions_key

# Display the private key
cat ~/.ssh/github_actions_key

# Display the public key (for VPS)
cat ~/.ssh/github_actions_key.pub
```

### 4. Add Public Key to VPS

```bash
# Method 1: Copy public key manually
cat ~/.ssh/id_ed25519.pub
# Then SSH to VPS and add to: ~/.ssh/authorized_keys

# Method 2: Use ssh-copy-id
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@your-vps-ip
```

### 5. Test SSH Connection

```bash
# Test with your current key
ssh -i ~/.ssh/id_ed25519 username@your-vps-ip

# Test with verbose output for debugging
ssh -vvv -i ~/.ssh/id_ed25519 username@your-vps-ip
```

### 6. GitHub Secrets Configuration

Go to: `https://github.com/BayajidAlam/ex-commerce/settings/secrets/actions`

**Required secrets:**

- `VPS_HOST`: Your VPS IP (e.g., `123.456.789.012`)
- `VPS_USERNAME`: Your VPS username (e.g., `root`, `ubuntu`, `bayajidswe`)
- `VPS_SSH_KEY`: **ENTIRE private key content** (from `cat ~/.ssh/id_ed25519`)
- `VPS_PORT`: SSH port (usually `22`)

### 7. Common Issues & Solutions

#### Issue: "no key found"

- **Cause**: Private key format not recognized
- **Fix**: Use OpenSSH format, ensure complete key is copied

#### Issue: "authentication failed"

- **Cause**: Public key not on VPS or wrong username
- **Fix**: Add public key to VPS authorized_keys

#### Issue: "connection refused"

- **Cause**: Wrong IP, port, or SSH disabled
- **Fix**: Verify VPS_HOST and VPS_PORT

### 8. Alternative: Use Password Authentication

If SSH keys continue to fail, temporarily use password:

```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    password: ${{ secrets.VPS_PASSWORD }} # Add this secret
    port: ${{ secrets.VPS_PORT }}
    script: |
      # Your deployment script
```

### 9. Debug Steps

1. **Run the debug workflow**: `.github/workflows/test-ssh-debug.yml`
2. **Check VPS SSH logs**: `sudo tail -f /var/log/auth.log`
3. **Verify SSH service**: `sudo systemctl status ssh`
4. **Check SSH config**: `sudo nano /etc/ssh/sshd_config`

### 10. VPS SSH Configuration

Ensure your VPS allows SSH key authentication:

```bash
# On VPS, check SSH config
sudo nano /etc/ssh/sshd_config

# Ensure these are set:
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication yes  # temporary fallback

# Restart SSH service
sudo systemctl restart ssh
```

## Quick Fix Commands:

```bash
# 1. Get your private key
cat ~/.ssh/id_ed25519

# 2. Get your public key
cat ~/.ssh/id_ed25519.pub

# 3. Test SSH connection
ssh username@your-vps-ip

# 4. Check VPS authorized keys
ssh username@your-vps-ip "cat ~/.ssh/authorized_keys"
```

After completing these steps, update your GitHub secrets and try the deployment again.
