package com.oss.api.responses.crud;

import com.oss.api.responses.BaseResponseWithData;

public class UpdateResponse extends BaseResponseWithData {
    public UpdateResponse(Object data) {
        super(200, "Успішно оновлено", data);
    }
}
