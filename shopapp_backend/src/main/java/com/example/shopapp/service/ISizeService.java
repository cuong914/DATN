package com.example.shopapp.service;

import com.example.shopapp.dtos.SizeDTO;
import com.example.shopapp.models.Size;

import java.util.List;

public interface ISizeService {
    Size createSize(SizeDTO size);

    Size getSizeById(long id);

    List<Size> getAllSizes();

    Size updateSize(long sizeId, SizeDTO size);

    void deleteSize(long id);

}
