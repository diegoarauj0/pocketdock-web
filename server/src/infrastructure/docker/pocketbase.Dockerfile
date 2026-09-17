FROM alpine:3.22

ARG VERSION
ARG PORT=8080

ENV PORT=${PORT}

RUN apk add --no-cache \
  unzip \
  ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE ${PORT}

CMD /pb/pocketbase serve --http=0.0.0.0:${PORT}