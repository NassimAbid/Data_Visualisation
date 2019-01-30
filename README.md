**Intro**

Creating an Internet application for analysis & visualisation of REF2014 and associated data.

I first researched this hierarchical diagram,
- https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8


---

## Coursework

This coursework is to produce an interactive internet application for analysis & visualisation of REF 2014 and associated data.

It must fill these general requirements of,

- [ ] A client side internet application written in D3.js is required. No php or serverside code should be used
- [ ] The layout and user interaction should be intuitive to the user
- [ ] In particular, transitions should be used to let the viewer know what data are new, changing, or exiting.
- [ ] Environment: The application must run in a recent version of Firefox
- [ ] The project and report should show evidence of the student having detailed and critical knowledge of design the patterns presented in the course.
- [ ] You must use the d3.js version 4 library. No other libraries are allowed.

Layout requirements,

- [ ] At least three different D3 layouts must be used in a single dashboard.
- [ ] These should include one layout as described in a) and one layout as described in b):
	- [ ] One of: a scatter plot, a stacked barchart or, a linechart
	- [ ] A D3 hierarchical layout e.g. cluster, pack, partition, treemap, sunburst, or bundle, but a not tree layout.
- [ ] Note that tree layouts may be used but do not count in satisfying requirement 2b

Interaction requirements,

- [ ] There must be interaction between three layouts in response to user mouseovers or clicks.
- [ ] Interactions between layouts (L1-3), must occur in all directions (L1 to L2&3, L2 to L1&3, and L3 to L1&2)
- [ ] Interactions should be intuitive to the user.
- [ ] Transitions must be used to make changes to data displayed obvious

Design and documentation requirements,

- [ ] The source code must be modular
	– i.e. divided into appropriate files to allow for easy development and reuse,
	– a module will normally be represented by a single source file **and use information hiding techniques**

Mandatory Data requirements,

- [ ] You must make use of the Topic Vector data in your dashboard
	- An example of these data taken from lab4-ex1 for one institution/UoA is
	- These are also available in an array of objects format
	
### Other Data
- You may use other publically available data, but you must clearly identify the source and quote the usage rights
- Examples could include other tables from the REF 2014 site and data from Gateway To Research.

### Originality Expected
Students are expected to show examples of original contribution.
The term ‘original’ here means something that has not been presented in class or is contained in the course’s notes.
Examples could include:

- Using d3 layouts and shape generators not in examples
- Adapting or generating new shape generators
- Adapting or generating new layout generators
- Providing new combinations of layouts and shape generators
- Providing novel and imaginative interactions
- Using publically available data not provided as part of this brief
	– But not code!!!!!
	– And check usage rights!
- Or simply just surprise us
	
