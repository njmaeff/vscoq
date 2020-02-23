FROM coqorg/coq

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
    && sudo apt-get install -y nodejs net-tools \
    && echo 'eval $(opam env)' >> $HOME/.bashrc