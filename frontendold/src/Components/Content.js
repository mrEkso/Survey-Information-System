import React, {Component} from "react"
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material';
import PollIcon from '@mui/icons-material/PollOutlined';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            subtitle: '',
            selectedOption: '',
        };
    }

    handleOptionChange = (event) => {
        this.setState({selectedOption: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Добавьте здесь логику для отправки данных опроса
        console.log('Отправлен опрос:', this.state);
    };

    render() {
        const {title, subtitle, selectedOption} = this.state;

        return (
            <div className="container-fluid bg-gold">
                <div className="container">
                    <div className="row justify-content-center">

                    </div>
                </div>
            </div>
        )
    }
}

export default Content;

