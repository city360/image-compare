import React from "react";
import { render } from "react-dom";
import HtmlViewer from "./components/dumbs/HtmlViewer/HtmlViewer";
import CodeHighLight from "./components/dumbs/CodeHighLight/CodeHighLight";

import "./styles.scss";

const html = `
  <div>
    <h2>Image</h2>
    <img src="https://images.pexels.com/photos/3052360/pexels-photo-3052360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
    <img class="alignnone size-large wp-image-152 embed-vis" src="https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-1024x683.jpg" alt="" width="1024" height="683" srcset="https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-1024x683.jpg 1024w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-300x200.jpg 300w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-770x513.jpg 770w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-100x66.jpg 100w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-370x247.jpg 370w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-1155x770.jpg 1155w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-293x195.jpg 293w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118-1400x934.jpg 1400w, https://179324-566621-raikfcquaxqncofqfm.stackpathdns.com/zeen-style/wp-content/uploads/sites/4/2018/03/zeen-00118.jpg 1600w" sizes="(max-width: 1024px) 100vw, 1024px">
    <h2>Compare image</h2>
    <div
      class="react-compare-image" 
      data-before-image="https://images.pexels.com/photos/2473845/pexels-photo-2473845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
      data-after-image="https://images.pexels.com/photos/2376997/pexels-photo-2376997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      data-before-text="Before"
      data-after-text="After"
    ></div>

    <h2>Restaurant menu</h2>

    <div class="wil-restaurant-menu mb3">
      <div class="wil-restaurant-menu__header b-primary">
        <h2 class="wil-restaurant-menu__title">Why do we use it?</h2>
        <div class="wil-restaurant-menu__line"></div>
        <div class="wil-ribbon bg-primary"><div class="wil-ribbon__shape b-primary"></div>$30</div>
      </div>
      <div class="wil-restaurant-menu__body">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
    </div>

    <div class="wil-restaurant-menu mb3">
      <div class="wil-restaurant-menu__header b-primary">
        <h2 class="wil-restaurant-menu__title">Where can I get some?</h2>
        <div class="wil-restaurant-menu__line"></div>
        <div class="wil-ribbon bg-primary"><div class="wil-ribbon__shape b-primary"></div>$60</div>
      </div>
      <div class="wil-restaurant-menu__body">It is a long established fact that a reader will be distracted by the readable content</div>
    </div>

    <div class="wil-restaurant-menu mb3">
      <div class="wil-restaurant-menu__header b-primary">
        <h2 class="wil-restaurant-menu__title">Why do we use it?</h2>
        <div class="wil-restaurant-menu__line"></div>
        <div class="wil-ribbon bg-primary"><div class="wil-ribbon__shape b-primary"></div>$30</div>
      </div>
      <div class="wil-restaurant-menu__body">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
    </div>

    <div class="wil-restaurant-menu mb3">
      <div class="wil-restaurant-menu__header b-primary">
        <h2 class="wil-restaurant-menu__title">Where can I get some?</h2>
        <div class="wil-restaurant-menu__line"></div>
        <div class="wil-ribbon bg-primary"><div class="wil-ribbon__shape b-primary"></div>$60</div>
      </div>
      <div class="wil-restaurant-menu__body">It is a long established fact that a reader will be distracted by the readable content</div>
    </div>

    <h2>Gallery</h2>
    <div
      class="react-gallery"
      data-gallery='[{id: 1, image: "Image 1" }, {id: 2, image: "Image 2" }]'
      data-column="3"
    ></div>

    <h2>Code highlight</h2>

    <code class="react-code-highlight" data-language="jsx">
    function HelloMessage({ name }) {
      return &lt;div&gt;Hello {name}&lt;/div&gt;;
    }
    
    ReactDOM.render(
      &lt;HelloMessage name="Taylor" /&gt;,
      document.getElementById('container')
    );
    </code>

    <code class="react-code-highlight" data-language="css">
    .wil_action__toggle_common_sidebar {
      color: black;
    }
    .wil_action__toggle_common_sidebar.active {
      color: #6943d0;
    }
    .wil_action__toggle_common_sidebar.open_common_sidebar {
      color: red;
    }
    </code>
  </div>
`;

const App = () => (
  <div>
    <HtmlViewer>{html}</HtmlViewer>
    <CodeHighLight language="jsx">{`
    function HelloMessage({ name }) {
      return <div>Hello {name}</div>;
    }
    
    ReactDOM.render(
      <HelloMessage name="Taylor" />,
      document.getElementById('container')
    );
  `}</CodeHighLight>
    <CodeHighLight language="php">{`
    <?php

      // Pre PHP 7 code
      class Logger
      {
          public function log($msg)
          {
              echo $msg;
          }
      }

      $util->setLogger(new Logger());

      // PHP 7+ code
      $util->setLogger(new class {
          public function log($msg)
          {
              echo $msg;
          }
      });
          `}</CodeHighLight>
    {/* <GridRenderProps data={} render=Post /> */}
    {/* <GridRenderProps data={} render=Product /> */}
  </div>
);

render(<App />, document.getElementById("root"));
