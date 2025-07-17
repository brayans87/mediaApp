package com.mitocode.controller;

import com.mitocode.dto.PatientDTO;
import com.mitocode.model.Patient;
import com.mitocode.service.IPatientService;
import com.mitocode.util.MapperUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class PatientController {

    //@Autowired
    private final IPatientService service;
    //@Qualifier("defaultMapper")
    //private final ModelMapper modelMapper;
    private final MapperUtil mapperUtil;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> findAll() throws Exception {
        //ModelMapper modelMapper = new ModelMapper();
        //List<PatientDTO> list = service.findAll().stream().map(e -> new PatientDTO(e.getIdPatient(), e.getFirstName(), e.getLastName(), e.getDni(), e.getAddress(), e.getPhone(), e.getEmail())).toList();
        //List<PatientDTO> list = service.findAll().stream().map(this::convertToDto).toList(); // e -> convertToDto(e)
        List<PatientDTO> list = mapperUtil.mapList(service.findAll(), PatientDTO.class);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> findById(@PathVariable("id") Integer id) throws Exception {
        Patient obj = service.findById(id);
        //return ResponseEntity.ok(convertToDto(obj));
        return ResponseEntity.ok(mapperUtil.map(obj, PatientDTO.class));
    }

    @PostMapping
    //@ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> save(@Valid @RequestBody PatientDTO dto) throws Exception {
        //Patient obj = service.save(convertToEntity(dto));
        Patient obj = service.save(mapperUtil.map(dto, Patient.class));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdPatient()).toUri();
        //localhost:8080/patients/6
        return ResponseEntity.created(location).build();
        //return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@Valid @RequestBody PatientDTO dto, @PathVariable("id") Integer id) throws Exception {
        dto.setIdPatient(id);
        //Patient obj = service.update(convertToEntity(dto), id);
        Patient obj = service.update(mapperUtil.map(dto, Patient.class), id);

        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Patient>> listPage(Pageable pageable) throws Exception {
        Page<Patient> page = service.listPage(pageable);

        return ResponseEntity.ok(page);
    }

    /*private Patient convertToEntity(PatientDTO dto) {
        return modelMapper.map(dto, Patient.class);
    }

    private PatientDTO convertToDto(Patient entity) {
        return modelMapper.map(entity, PatientDTO.class);
    }*/

    /*public PatientController(IPatientService service) {
        this.service = service;
    }*/

    /*@GetMapping
    public Patient savePatient() {
        //service = new PatientService();
        Patient obj = new Patient(5, "mito", "code", "147", "Peru", "159", "demo@demo.com");
        return service.validAndSave(obj);
    }*/
}
