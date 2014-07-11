all: build

install:
	mkdir $@

install/package.zip: install
	zip -r $@ . -x ".*" -x "*/.*" -x Makefile -x "install/*"

build: install/package.zip

clean: install/package.zip
	rm $^

.PHONY: clean
