update:
	git pull --recurse-submodules

release:
	./scripts/release.sh

install:
	$(MAKE) -C packages install

build:
	$(MAKE) -C packages build

cap-sync: build
	$(MAKE) -C packages cap-sync

clean-android:
	cd packages/apps/web-ui/android && \
	./gradlew clean

build-aab:
	cd packages/apps/web-ui/android && \
	./gradlew bundleRelease

build-apk:
	cd packages/apps/web-ui/android && \
	./gradlew assembleRelease

build-android: clean-android cap-sync
	$(MAKE) build-apk build-aab
	mkdir -p android
	cp -r packages/apps/web-ui/android/app/build/outputs/* android

build-ios: cap-sync
	echo "no ios build yet"

build-web:
	$(MAKE) -C packages build
	mkdir -p public
	rm -rf public/*
	cp -r packages/apps/web-ui/dist/* public
