
SRCS :=  cancerfool.vc
OBJS := $(SRCS:%=%.out)

all: $(OBJS) wapner.py
	$(info $^)

%.vc.out: %.vc wapner.py
	python3 wapner.py $<  >$@





