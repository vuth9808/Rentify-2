package com.javaweb.enums;

import java.util.Map;
import java.util.TreeMap;

public enum TypeCode
{
    NOI_THAT("Nội Thất"),
    NGUYEN_CAN("Nguyên Căn"),
    TANG_TRET("Tầng Trệt");

    private final String name;

    TypeCode(String name)
    {
        this.name = name;
    }

    public static Map<String, String> type()
    {
        Map<String, String> typeCodes = new TreeMap<>();
        for(TypeCode it : TypeCode.values())
        {
            typeCodes.put(it.toString(), it.name);
        }
        return typeCodes;
    }
}
