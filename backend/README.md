# Home app backend

To build the artifact with a non-snapshot version, one needs to explicitly add the version as follows.

```shell
   mvn clean install -Drevision=0.0.0
```

# Running a local postgres development db:

```shell
   podman kube play postgres.yaml --network=slirp4netns
```
