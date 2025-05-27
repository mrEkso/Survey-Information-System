package com.oss.api.responses.crud;

import com.oss.api.responses.BaseResponseWithData;

public class CreateResponse extends BaseResponseWithData {
    public CreateResponse(Object data) {
        super(201, "Успішно створено", data);
    }
}
