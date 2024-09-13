update:
	git pull --recurse-submodules

install:
	$(MAKE) -C packages install

build-android:
	$(MAKE) -C packages build cap-sync

build-ios:
	$(MAKE) -C packages build cap-sync

build-web:
	$(MAKE) -C packages build
	mkdir -p public
	rm -rf public/*
	cp -r packages/apps/web-ui/dist/* public
