package com.oss.api.services;

public interface modelMapperable<T, S> {
    public S convertToDto(T t);

    public T convertToEntity(S s);
}
