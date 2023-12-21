package com.example.oss.api.responses.crud;

import com.example.oss.api.responses.BaseResponse;

public class DeleteResponse extends BaseResponse {
    public DeleteResponse() {
        super(204, "delete");
    }
}
