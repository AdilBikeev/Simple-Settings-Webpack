import Post from './Post'
import WebpackLogo from './assets/webpack-logo.png'
import './styles/styles.css'
import './styles/less.less'
import React from 'react'
import { render } from 'react-dom'
import CSV from './assets/data.csv'
import XML from './assets/data.xml'

const post = new Post("Webpakc Post title", WebpackLogo);

console.log(post.toString());
console.log(CSV);

console.log(XML);


const App = () => (<div class="container">
    <h1>WebpackCouse</h1>
    <hr />
    <div class="logo"></div>

    <hr />

    <div class="box">
        <h2>less</h2>
    </div>
</div>)

render(<App />, document.getElementById('App'));
