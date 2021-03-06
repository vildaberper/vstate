# vstate

A simple subscribable state container. Capable of selective subscriptions on a property basis.

## Usage

```typescript
import vState from "@vildaberper/vstate";

const state = vState({
  loading: false,
  title: "hello",
  nested: {
    property: 1,
  },
});

// Read from state:
const loading = state.loading;

// Update state:
state.loading = true;

// Use dispatch for nested properties:
state.nested.property = 2;
state.dispatch("nested");

// Fully typed subscriber callback:
const unsubscribe = state.subscribe(
  (title, prevTitle, key) => {
    console.log(title, prevTitle, key);
  },
  ["title"]
);

// Returns unsubscribe-function:
unsubscribe();

// To subscribe to the whole state, omit second parameter:
state.subscribe((value, prevValue, key) => {
  console.log(key + " changed from " + prevValue + " to " + value);
});
```

### React

```typescript
// This pairs very well with useEffect:
useEffect(
  () =>
    state.subscribe(
      title => {
        setTitle(title);
      },
      ["title"]
    ),
  [setTitle]
);
```
