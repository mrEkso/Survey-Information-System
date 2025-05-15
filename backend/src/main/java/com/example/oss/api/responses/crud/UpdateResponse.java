package com.example.oss.api.responses.crud;

import com.example.oss.api.responses.BaseResponseWithData;

public class UpdateResponse extends BaseResponseWithData {
    public UpdateResponse(Object data) {
        super(200, "Успішно оновлено", data);
    }
}
