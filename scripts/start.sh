#!/bin/bash

if [ $# -eq 0 ]; then
    echo "MISSING: File to run."
    exit 1
fi

running_processes=$(ps -ef | grep "node $1" | wc -l)
if [ "$running_processes" -gt 1 ]; then
    echo "node server is already running"
    ps -ef | grep "node $1"
    exit 0
else
    echo "starting node server.."
fi

nohup node $1 > $2 2>&1 &
echo "node server started with process id:"
ps -ef | grep "node $1"
echo "log file is at $2"