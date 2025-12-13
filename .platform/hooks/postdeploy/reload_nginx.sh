#!/bin/bash

sudo nginx -s reload

if [ $? -ne 0 ]; then
    echo "nginx reload failed. killing nginx and restarting..."

    sudo pkill nginx
    sudo systemctl restart nginx
else
    echo "nginx reload success."
fi