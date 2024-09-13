update:
	git pull --recurse-submodules

install:
	$(MAKE) -C packages install

cap-sync:
	$(MAKE) -C packages build cap-sync

build-aab:
	cd packages/apps/web-ui/android && \
	./gradlew clean bundleRelease --stacktrace

build-apk:
	cd packages/apps/web-ui/android && \
	./gradlew assembleRelease --stacktrace

build-android: cap-sync
	$(MAKE) build-apk build-aab
	cp -r packages/apps/web-ui/android/app/build/outputs/bundle/* android

build-ios: cap-sync
	echo "no ios build yet"

build-web:
	$(MAKE) -C packages build
	mkdir -p public
	rm -rf public/*
	cp -r packages/apps/web-ui/dist/* public
