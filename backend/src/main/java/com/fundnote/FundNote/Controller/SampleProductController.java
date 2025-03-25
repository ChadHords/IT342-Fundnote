package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.SampleProductEntity;
import com.fundnote.FundNote.Service.SampleProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/product")
public class SampleProductController {

    @Autowired
    private SampleProductService productService;

    @PostMapping("/create")
    public String saveProduct(@RequestBody SampleProductEntity product) throws ExecutionException, InterruptedException {

        return productService.saveProduct(product);
    }
}
