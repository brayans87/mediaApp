package com.mitocode.model;

import jakarta.persistence.*;
import lombok.*;

/*@Getter
@Setter
@ToString
@EqualsAndHashCode*/

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
//@Table(name = "tbl_patient")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idPatient;

    @Column(nullable = false, length = 70) //, name = "primer_nombre"
    private String firstName; //camelCase | lowerCamelCase firstName | UpperCamelCase | DB: snake _ first_name

    @Column(nullable = false, length = 70)
    private String lastName;

    @Column(nullable = false, length = 8)
    private String dni;

    @Column(length = 150)
    private String address;

    @Column(nullable = false, length = 9)
    private String phone;

    @Column(nullable = false, length = 55)
    private String email;

}
