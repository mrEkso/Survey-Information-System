import Content from "@components/Content.jsx";
import Footer from "@components/Footer.jsx";
import Header from "@components/Header";
import React, { Component } from 'react';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { hasSurveys: true };
    }

    handleSurveyPresenceChange = (hasSurveys) => {
        if (this.state.hasSurveys !== hasSurveys) {
            this.setState({ hasSurveys });
        }
    };

    render() {
        return (
            <>
                <Header />
                <Content onSurveyPresenceChange={this.handleSurveyPresenceChange} />
                {this.state.hasSurveys && <Footer mt={2} />}
            </>
        )
    }
}