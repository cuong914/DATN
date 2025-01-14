package com.example.shopapp.service;

import com.example.shopapp.dtos.ColorDTO;
import com.example.shopapp.models.Color;
import com.example.shopapp.repositorys.ColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // kiem tra xem cos nhung thuoc tinh nao thi no se tao ra contructer tuong ung
public class ColorService implements IColorService {

    private final ColorRepository colorRepository;// thuoc tinh

    @Override
    public Color createColor(ColorDTO colorDTO) {
        Color newColor = Color.builder()
                .name(colorDTO.getName())
                .build();
        return colorRepository.save(newColor);
    }

    @Override
    public Color getColorById(long id) {
        return colorRepository.findById(id)// su dung bieu thuc lamda de hien thi exception
                .orElseThrow(() -> new RuntimeException("Color not foud"));
    }

    @Override
    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    @Override
    public Color updateColor(long colorId, ColorDTO colorDTO) {
        Color existingColor = getColorById(colorId);
        existingColor.setName(colorDTO.getName());
        colorRepository.save(existingColor);
        return existingColor;
    }

    @Override
    public void deleteColor(long id) {
// xoa cung
        colorRepository.deleteById(id);
    }
}
