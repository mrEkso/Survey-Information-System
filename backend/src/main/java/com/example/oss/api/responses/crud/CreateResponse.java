package com.example.oss.api.responses.crud;

import com.example.oss.api.responses.BaseResponseWithData;

public class CreateResponse extends BaseResponseWithData {
    public CreateResponse(Object data) {
        super(201, "Успішно створено", data);
    }
}
