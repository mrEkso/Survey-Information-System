import {Component} from 'react'
import Header from "@components/Header";
import Content from "@components/Content.jsx";

export default class Home extends Component {
    render() {
        return (
            <>
                <Header/>
                <Content/>
            </>
        )
    }
}