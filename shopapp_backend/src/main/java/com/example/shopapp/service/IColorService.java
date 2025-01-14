package com.example.shopapp.service;

import com.example.shopapp.dtos.ColorDTO;
import com.example.shopapp.models.Color;

import java.util.List;

public interface IColorService {
    Color createColor(ColorDTO size);

    Color getColorById(long id);

    List<Color> getAllColors();

    Color updateColor(long sizeId, ColorDTO size);

    void deleteColor(long id);

}
