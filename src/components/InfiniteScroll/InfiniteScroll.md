```js
const style = {
  width: '200px',
  height: '100px',
  overflow: 'auto'
};

let i = 0;

const onFetchMore = () =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => resolve(++i), 2000);
  });

<InfiniteScroll onFetchMore={onFetchMore}>
  {({ data, isLoading }) => {
    return (
      <div style={style}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias dicta
        tempore suscipit dolorem reiciendis impedit amet, laudantium, pariatur
        sed vitae illo. Omnis dolores magnam deserunt iure. Quasi illo ea beatae
        magnam libero magni voluptatum exercitationem porro, vel voluptatem
        aliquid? In voluptatibus tempore libero deserunt aliquam, neque, odit
        expedita, sit modi repudiandae ipsum quibusdam sunt ab vitae eligendi.
        Ex neque, placeat sunt et est dolorem rem quidem laborum non
        repudiandae, esse illo voluptate ea quibusdam quasi odit sequi! Dolorem
        repellendus aliquam dolores unde facere nihil reiciendis impedit
        delectus nostrum iusto ea rerum hic nobis, inventore at esse quaerat
        voluptatibus explicabo quibusdam. Velit doloremque cupiditate aspernatur
        rerum, aperiam placeat eveniet illo sunt eos dicta, deserunt commodi
        repellat molestiae porro sequi, ipsa minus voluptates ea officia
        possimus natus vitae explicabo qui nesciunt! Labore, ab blanditiis. Rem,
        error? Similique culpa enim cum dolor soluta reprehenderit excepturi
        veritatis! Laboriosam nostrum, nisi tenetur quibusdam, explicabo nemo
        harum recusandae vero optio eius a
      </div>
    );
  }}
</InfiniteScroll>;
```
