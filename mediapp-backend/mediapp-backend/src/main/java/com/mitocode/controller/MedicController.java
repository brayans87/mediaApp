package com.mitocode.controller;

import com.mitocode.dto.MedicDTO;
import com.mitocode.model.Medic;
import com.mitocode.service.IMedicService;
import com.mitocode.util.MapperUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/medics")
@RequiredArgsConstructor
public class MedicController {

    private final IMedicService service;
    private final MapperUtil mapperUtil;

    //@Qualifier("medicMapper")
    //private final ModelMapper modelMapper;


    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    //@PreAuthorize("@authorizeLogic.hasAccess('findAll')")
    @GetMapping
    public ResponseEntity<List<MedicDTO>> findAll() throws Exception {
        //List<MedicDTO> list = service.findAll().stream().map(this::convertToDto).toList(); // e -> convertToDto(e)
        List<MedicDTO> list = mapperUtil.mapList(service.findAll(), MedicDTO.class, "medicMapper");

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicDTO> findById(@PathVariable("id") Integer id) throws Exception {
        Medic obj = service.findById(id);
        //return ResponseEntity.ok(convertToDto(obj));
        return ResponseEntity.ok(mapperUtil.map(obj, MedicDTO.class, "medicMapper"));
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody MedicDTO dto) throws Exception {
        //Medic obj = service.save(convertToEntity(dto));
        Medic obj = service.save(mapperUtil.map(dto, Medic.class, "medicMapper"));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdMedic()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medic> update(@Valid @RequestBody MedicDTO dto, @PathVariable("id") Integer id) throws Exception {
        dto.setIdMedic(id);
        //Medic obj = service.update(convertToEntity(dto), id);
        Medic obj = service.update(mapperUtil.map(dto, Medic.class, "medicMapper"), id);

        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    /*private Medic convertToEntity(MedicDTO dto) {
        return modelMapper.map(dto, Medic.class);
    }

    private MedicDTO convertToDto(Medic entity) {
        return modelMapper.map(entity, MedicDTO.class);
    }*/

}
