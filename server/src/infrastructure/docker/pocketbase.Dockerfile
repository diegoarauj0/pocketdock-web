FROM alpine:3.22

ARG POCKETBASE_VERSION

RUN apk add --no-cache \
  unzip \
  ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE ${PORT}

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:${PORT}"]