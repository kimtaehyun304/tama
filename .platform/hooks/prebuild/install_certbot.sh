#!/bin/bash
# beanstalk EC2 재생성 시 certbot, let's encrypt 자동 복구 스크립트

# certbot 설치 여부 확인
if [ ! -d /etc/letsencrypt/live ]; then
    echo "Certbot is not installed, proceeding with installation.."

    # certbot 설치
    sudo yum install -y certbot
    sudo yum install -y python3-certbot-nginx

    # 인증서 발급
    sudo certbot --nginx \
        -d dlta.kr \
        --email kimapbel@gmail.com \
        --agree-tos \
        --no-eff-email \
        --non-interactive

    # 인증서 갱신 후 Nginx 재시작 스크립트 생성
    sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh > /dev/null <<'EOF'
#!/bin/bash
echo "[INFO] Reloading Nginx after renewing certificate..."

# Nginx reload 시도
if ! /usr/sbin/nginx -s reload 2>/dev/null; then
    echo "[WARN] Nginx reload failed. Trying to free port 80..."
    
    # 80 포트 점유 프로세스 종료
    PORT_PID=$(sudo lsof -t -i:80)
    if [ -n "$PORT_PID" ]; then
        echo "[INFO] Killing process using port 80 (PID: $PORT_PID)"
        sudo kill -9 $PORT_PID
    else
        echo "[INFO] No process found using port 80."
    fi

    # 다시 reload 시도
    echo "[INFO] Retrying Nginx reload..."
    if /usr/sbin/nginx -s reload 2>/dev/null; then
        echo "[SUCCESS] Nginx reloaded successfully after freeing port 80."
    else
        echo "[ERROR] Nginx reload failed again. Consider checking manually."
    fi
else
    echo "[SUCCESS] Nginx reloaded successfully."
fi
EOF

    sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
else
    echo "Certbot is already installed, skipping installation."
fi
