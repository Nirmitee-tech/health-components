# CareOS in Angular

A standalone Angular app that uses CareOS through `health-components/elements` (custom elements).

```bash
cd ../.. && npm install && npm run build   # build the library first
cd examples/angular && npm install && npm start
```

See `src/main.ts` (registration), `src/app/app.component.ts` (`CUSTOM_ELEMENTS_SCHEMA`) and the template for attribute,
property (`[items]`) and event (`(co-change)`) bindings.
