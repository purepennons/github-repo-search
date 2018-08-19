```js
initialState = {
  text: ''
};

const onDebounceChange = event => {
  console.log('hook', event.target.value);
};

const onChange = event => {
  event.persist();
  console.log('change', event.target.value);
  setState({ text: event.target.value });
};

const options = { trailing: true };

<DebounceHookOnChange
  onChange={onChange}
  onDebounceChange={onDebounceChange}
  wait={500}
  options={options}
>
  {onChange => <input type="text" value={state.text} onChange={onChange} />}
</DebounceHookOnChange>;
```
