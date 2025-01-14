package com.example.shopapp.service;

import com.example.shopapp.dtos.SizeDTO;
import com.example.shopapp.models.Size;
import com.example.shopapp.repositorys.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // kiem tra xem cos nhung thuoc tinh nao thi no se tao ra contructer tuong ung
public class SizeService implements ISizeService {

    private final SizeRepository sizeRepository;// thuoc tinh

    @Override
    public Size createSize(SizeDTO sizeDTO) {
        Size newSize = Size.builder()
                .name(sizeDTO.getName())
                .build();
        return sizeRepository.save(newSize);
    }

    @Override
    public Size getSizeById(long id) {
        return sizeRepository.findById(id)// su dung bieu thuc lamda de hien thi exception
                .orElseThrow(() -> new RuntimeException("Size not foud"));
    }

    @Override
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();
    }

    @Override
    public Size updateSize(long sizeId, SizeDTO sizeDTO) {
        Size existingSize = getSizeById(sizeId);
        existingSize.setName(sizeDTO.getName());
        sizeRepository.save(existingSize);
        return existingSize;
    }

    @Override
    public void deleteSize(long id) {
// xoa cung
        sizeRepository.deleteById(id);
    }
}
