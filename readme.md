# Marko Feather

Feather icons as Marko Components

## Usage

```sh
yarn i marko-feather
```

```js
import GitHub from 'marko-feather/github'

// note: do not do this because unused modules do not get tree shaked
// tracked by issue #1
// import { GitHub } from 'marko-feather'

<${GitHub} color="#e9ecef" strokeWidth="2" size="48"></>
```

## Current Props

- size
- color
- stroke
- strokeWidth
