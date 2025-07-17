package com.mitocode.repo;

import com.mitocode.model.User;

public interface IUserRepo extends IGenericRepo<User, Integer>{

    //SELECT * FROM User u WHERE u.username = ?
    //@Query("FROM User u WHERE u.username = :username)
    User findOneByUsername(String username); //DerivedQueries
}
