# Docker aliases (shortcuts)
# List all containers by status using custom format
alias dkpsa='docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"'
# Removes a container, it requires the container name \ ID as parameter
alias dkrm='docker rm -f'
# Removes an image, it requires the image name \ ID as parameter
alias dkrmi='docker rmi'
# Lists all images by repository sorted by tag name
alias dkimg='docker image ls --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" | sort'
# Lists all persistent volumes
alias dkvlm='docker volume ls'
# Diplays a container log, it requires the image name \ ID as parameter
alias dklgs='docker logs'
# Streams a container log, it requires the image name \ ID as parameter
alias dklgsf='docker logs -f'
# Initiates a session withing a container, it requires the image name \ ID as parameter followed by the word "bash"
alias dkterm='docker exec -it'
# Starts a container, it requires the image name \ ID as parameter
# alias dkstrt='docker start'
# # Stops a container, it requires the image name \ ID as parameter
# alias dkstp='docker stop'

# Absolute path to this script. /home/user/bin/foo.sh
SCRIPTPATH=$(readlink -f $0)
# Absolute path this script is in. /home/user/bin
export PROJECTROOT=`dirname $SCRIPTPATH`

set -o allexport
# source $PROJECTROOT/.env
set +o allexport


alias nj.log="docker run --rm \
-v /var/run/docker.sock:/var/run/docker.sock \
-p 127.0.0.1:1234:1234 \
bobrik/socat -v TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock"

alias nj.share="docker run --rm -d --name nfs --network host --privileged -v $PROJECTROOT:/njmaeff -v $PROJECTROOT/.exports:/etc/exports erichough/nfs-server"

function nj.share.d()
{
    CWD=$(pwd)
    docker run --name nfs --rm --network host -d \
    --privileged -v $CWD/exports:/etc/exports -v $CWD/share:/njmaeff \
    erichough/nfs-server
}

function nj.reload() {
    source "$PROJECTROOT/.profile"
}
