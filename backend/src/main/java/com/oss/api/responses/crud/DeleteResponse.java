package com.oss.api.responses.crud;

import com.oss.api.responses.BaseResponse;

public class DeleteResponse extends BaseResponse {
    public DeleteResponse() {
        super(204, "Успішно видалено");
    }
}
