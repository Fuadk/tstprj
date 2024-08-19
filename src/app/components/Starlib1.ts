//import { starServices } from 'starlib';

import { Injectable } from '@angular/core';
import { starServices } from 'starlib';
import { formatDate } from '@angular/common';
import { getDate } from '@progress/kendo-date-math';

declare function getParamConfig(): any;
@Injectable({
  providedIn: 'root',
})
export class Starlib1 {

  constructor(public starServices: starServices) {

  }
  public FORM_TRIGGER_FAILURE;
  public NOTFOUND = false;


  private Body = [];
  private commitBody = [];
  public inTrans = false;

  private addToBody(NewVal) {
    this.Body.push(NewVal);
  }

  async checkBO_BOX(po_Box) {
    //POBOX_CURSOR

      this.FORM_TRIGGER_FAILURE = false;
      this.starServices.sessionParams["ADDRESS_CHANGED"] = 'TRUE';
      let sqlStmt = "select 'X' from CRM_POSTAL_ROWS "
         + "    where '" + po_Box + "'  BETWEEN FROM_PO_BOX AND TO_PO_BOX";

      let CRM_POSTAL_ROWSInfo;
      CRM_POSTAL_ROWSInfo = await this.starServices.execSQL(this, sqlStmt);
      console.log("testing CRM_POSTAL_ROWSInfo:", CRM_POSTAL_ROWSInfo);
      if (this.FORM_TRIGGER_FAILURE == true) {
         return;
      }
      else {
         if (CRM_POSTAL_ROWSInfo.length != 0) { //FOUND
         }
         else {
            this.starServices.showNotification("error", this.starServices.getNLS([], 'PO _BOX_NOT_IN_THIS_POSTAL_AREA', 'P.O .BOX NOT IN THIS POSTAL AREA'));
            this.FORM_TRIGGER_FAILURE = true;
            return;
         }
      }



  }
  public checkBO_BOX_ORG() {
    /*--nsk
    if :VALIDATE_POST_AREA = 'Y' then
    
    IF :contract.address IS NULL THEN
    DECLARE
      CURSOR POBOX_CUR IS
      SELECT 'X'
      FROM crm_postal_rows
      WHERE :contract.po_box BETWEEN from_po_box AND to_po_box
      AND   post_area = :contract.post_area;
      temp  VARCHAR2(1);
    BEGIN
      :ADDRESS_CHANGED := 'TRUE';
        OPEN POBOX_CUR;
        FETCH POBOX_CUR INTO temp;
        IF POBOX_CUR%NOTFOUND THEN
          tabs_mess(3169,'LANGUAGE_NAME');
          RAISE this.FORM_TRIGGER_FAILURE;
        END IF;
        CLOSE POBOX_CUR;
    END;
    end if;
    
    END IF;*/
  }
  async get_last_traffic_date(w_billgroup) {
    let w_date = "";
    let sqlStmt = "select min(LAST_TRAFFIC_DATE) W_DATE from DBM_TRAFFIC_DATE   where UNBOOKED = 'NO' and   BILLGROUP = '" + w_billgroup + "'";
    let dbm_traffic_dateInfo;
    dbm_traffic_dateInfo = await this.starServices.execSQL(this, sqlStmt);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return (w_date);
    }
    else {
      if (dbm_traffic_dateInfo.length != 0) {
        w_date = dbm_traffic_dateInfo[0]["W_DATE"];
        return (w_date);
      }
    }

  }
  public get_last_traffic_date_org(w_billgroup) {
    /*
    cursor c1 is
      select min(last_traffic_date) w_date
      from dbm_traffic_date
      where unbooked = 'NO'
      and   billgroup = w_billgroup;
    wc1 c1%rowtype;
    w_found boolean;
    BEGIN
      open c1;
      fetch c1 into wc1;  
      w_found := c1%found;
      close c1;
      return (wc1.w_date);
    END;
*/
  }
  async get_text_value(CODENAME, LANGUAGE_NAME, PARTCODE, CODE) {
    let textValue = {};
    if (PARTCODE == null) {
      PARTCODE = "%"
    }
    var sqlStmt = "select CODENAME, CODE, PARTCODE, LANGUAGE_NAME, CODETEXT_LANG, CODEVALUE_LANG, LAST_UPDATE, FLEX_FLD1, FLEX_FLD2, FLEX_FLD3, FLEX_FLD4, FLEX_FLD5, CODEVALUE2 "
      + " from SOM_TABS_CODES "
      + " where codename  = '" + CODENAME + "'"
      + " and   code     = '" + CODE + "'"
      + " and   PARTCODE     like  '" + PARTCODE + "'"
      + " and   language_name = '" + LANGUAGE_NAME + "'";

    let SOM_TABS_CODESInfo = await this.starServices.execSQL(this, sqlStmt);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (SOM_TABS_CODESInfo.length != 0)
        textValue = SOM_TABS_CODESInfo;
    }
    return (textValue);
  }

  async get_codevalue(CODENAME, LANGUAGE_NAME, PARTCODE, CODE) {
    let CODEVALUE_LANG = "";
    if (PARTCODE == null) {
      PARTCODE = "%"
    }
    var sqlStmt = "select CODENAME, CODE, PARTCODE, LANGUAGE_NAME, CODETEXT_LANG, CODEVALUE_LANG, LAST_UPDATE, FLEX_FLD1, FLEX_FLD2, FLEX_FLD3, FLEX_FLD4, FLEX_FLD5, CODEVALUE2 "
      + " from SOM_TABS_CODES "
      + " where codename  = '" + CODENAME + "'"
      + " and   code     like '" + CODE + "'"
      + " and   PARTCODE     like  '" + PARTCODE + "'"
      + " and   language_name = '" + LANGUAGE_NAME + "'";

    let SOM_TABS_CODESInfo = await this.starServices.execSQL(this, sqlStmt);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (SOM_TABS_CODESInfo.length != 0) {
        console.log("testing: ", SOM_TABS_CODESInfo)
        CODEVALUE_LANG = SOM_TABS_CODESInfo[0].CODEVALUE_LANG;
      }
    }
    console.log("testing:CODEVALUE_LANG: ", CODEVALUE_LANG)
    return (CODEVALUE_LANG);
  }
  async check_rule(w_rule_id, w_routine) {
    let rule_active = "";
    let sqlStmt = "select b.rule_active rule_active "
      + "  from SOM_RULES_ROUT  a, SOM_TABS_RULES b "
      + "  where a.rule_id = '" + w_rule_id + "'"
      + "  and   a.routine_name = '" + w_routine + "'"
      + "  and   b.rule_id = a.rule_id ";
    let SOM_TABS_RULESInfo;
    SOM_TABS_RULESInfo = await this.starServices.execSQL(this, sqlStmt);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return (rule_active);
    }
    else {
      if (SOM_TABS_RULESInfo.length != 0)
        rule_active = SOM_TABS_RULESInfo[0]["rule_active"];
    }
    return (rule_active);

  }

  public check_rule_org(w_rule_id, w_routine) {
    /*
    cursor c1 is 
      select b.rule_active
      from som_rules_rout a, som_tabs_rules b
      where a.rule_id = w_rule_id
      and   a.routine_name = w_routine
      and   b.rule_id = a.rule_id;
    wc1 c1%rowtype;
    w_found boolean;
    BEGIN
      open c1;
      fetch c1 into wc1;
      w_found := c1%found;
      close c1;
      if w_found and nvl(wc1.rule_active,'N') = 'Y' then
        w_found := TRUE;
      else
        w_found := FALSE;
      end if;
      return (w_found);
    END;
    */
  }

  public GET_DATE(): Date {
    let wtime: Date = new Date();
    return wtime;
  }

   GET_DATE_ISO():Date {
    let dateVal: Date = new Date();
    dateVal = this.starServices.FORMAT_ISO(dateVal); 
    return dateVal;
    }
  public get_dbdate() {
    let wtime: Date = new Date();
    return wtime;

  }

  public nvl(var1, var2) {
    if ((var1 == "") || (var1 == null))
      return var2;
    else
      return var1;

  }
  async spchk(sp_sotype, sp_subtype, sp_area, sp_subno, sp_serordno, sp_exc, sp_equipid, sp_equip_ordertype, sp_type_id, sp_excold) {
    let w_spdate, dummy, avlcnt, sp_system, sp_portno, sp_function, today, sp_appdate, xsp_sotype, xsp_serordno, w_sysdate;
    let retVal = {
      out_errorcode: "",
      out_function: "",
      out_system: "",
      out_portno: "",
      anyerror: ""
    }


    let anyerror = null;
     xsp_sotype = sp_sotype;
     xsp_serordno = sp_serordno;
    let sp_sotype_substr = sp_sotype.toString().substr(0, 4);
    if ((sp_sotype_substr != "LTST") && (sp_sotype_substr != "METR")) {
      if (sp_equipid.substr(0, 1) != " " && sp_equip_ordertype.substr(0, 4) == "INST") {
        if (sp_type_id.substr(0, 4) == "ROAM")
          sp_function = 'ROIN';
        else
          sp_function = 'SERI';
      }
      else if (sp_equipid.substr(0, 1) != " " && sp_equip_ordertype.substr(0, 4) == "DISC")
        sp_function = 'SERD';
      else if (sp_equipid.substr(0, 1) != " ")
        sp_function = 'SERI';
      else if (xsp_sotype == 10 || xsp_sotype == 20 || xsp_sotype == 22 || xsp_sotype == 60 || xsp_sotype == 62) {
        if (sp_type_id.substr(0, 4) == "ROAM")
          sp_function = 'ROIN';
        else
          sp_function = 'INST';
      }
      else if (xsp_sotype == 63 && sp_subtype == 'M')
        sp_function = 'SPCH';
      else if (xsp_sotype == 63 && sp_subtype == 'P')
        sp_function = 'TERM';
      else if (xsp_sotype == 63 && sp_subtype == 'G')
        sp_function = 'INST';
      else if (xsp_sotype == 21 || xsp_sotype == 23 || xsp_sotype == 50 || xsp_sotype == 55)
        sp_function = 'TERM';
      else if (xsp_sotype == 30)
        sp_function = 'CONP';
      else if (xsp_sotype == 40)
        sp_function = 'DINP';
      else if (xsp_sotype == 40)
        sp_function = 'DINP';
      else if (xsp_sotype == 13)
        sp_function = 'WANP';
      else if (xsp_sotype == 32 || xsp_sotype == 35)
        sp_function = 'CONN';
      else if (xsp_sotype == 42 || xsp_sotype == 45)
        sp_function = 'DISC';
      else if (xsp_sotype == 43 || xsp_sotype == 44)
        sp_function = 'BAOC';
      else if (xsp_sotype == 33)
        sp_function = 'CONB';
      else {
        retVal.out_errorcode = '011';
        return retVal;
      }
    }
    else {
      xsp_sotype = 0;
      xsp_serordno = null;
      let sp_function = sp_sotype.toString().substr(0, 4);
    }
    sp_system = "";
    sp_portno = "";
    today = "";
    sp_appdate = "";

    let sqlStmt = "SELECT SYSTEM, SLMC   FROM CRM_EXCHANGE "
      //INTO sp_system, sp_portno
      + "  WHERE AREA = '" + sp_area + "'"
      + "    AND EXC  = '" + sp_exc + "'";


    let CRM_EXCHANGEInfo;
    CRM_EXCHANGEInfo = await this.starServices.execSQL(this, sqlStmt);
    console.log("testing CRM_EXCHANGEInfo:", CRM_EXCHANGEInfo);
    if (this.FORM_TRIGGER_FAILURE == true) {
      sp_portno = '****';
      anyerror = 'ERROR SELECTING CRM_EXC ';
      retVal.out_errorcode = '013';
      retVal.out_function = sp_function;
      retVal.out_system = sp_system;
      retVal.out_portno = sp_portno;
      return retVal;
    }
    else {
      if (CRM_EXCHANGEInfo.length != 0) { //FOUND
        sp_system = CRM_EXCHANGEInfo[0]["SYSTEM"];
        sp_portno = CRM_EXCHANGEInfo[0]["SLMC"];
      }
      else {
        sp_portno = '****';
        retVal.out_errorcode = '013';
        retVal.out_function = sp_function;
        retVal.out_system = sp_system;
        retVal.out_portno = sp_portno;
        return retVal;
      }
    }
    if (sp_portno.substr(0, 1) == null || sp_portno.substr(0, 1) == ' ')
    retVal.out_errorcode = '012';


     sqlStmt = "SELECT 'X' DUMMY "
      //INTO DUMMY 
      + "    FROM EIM_COMMANDS "
      + "    WHERE SPC_FUNCTION = '" + sp_function + "'"
      + "    AND EXCSYSTEM      = '" + sp_system + "'"
      + "    AND ( equipid = '" + sp_equipid + "'"
      + "       or equipid is null) "
      + "    AND CMDNO          = 1 "
      + "    AND PARAMNO        = 1 ";

    let EIM_COMMANDSInfo;
    EIM_COMMANDSInfo = await this.starServices.execSQL(this, sqlStmt);
    console.log("testing EIM_COMMANDSInfo:", EIM_COMMANDSInfo);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return retVal;
    }
    else {
      if (EIM_COMMANDSInfo.length != 0) { //FOUND
        retVal.out_errorcode = '014';
        //return retVal;
      }
      else {
        retVal.out_errorcode = '014';
        //return (retVal);
      }
    }
    console.log("bug6 sp_sotype:", sp_sotype);
    if (sp_sotype.toString().substr(0, 4) != "LIST" && sp_sotype.toString().substr(0, 4) != "METR") {
       let sqlStmt = "SELECT APPDATE FROM CRM_ACTION_INFORMATION "
        //INTO w_spdate 
        + "      WHERE SUBSCR_TYPE    = '" + sp_subtype + "'"
        + "          AND AREA         = '" + sp_area + "'"
        + "          AND SUBNO        = '" + sp_subno + "'"
        + "          AND SERORDNO     = '" + xsp_serordno + "'";

      let CRM_ACTION_INFORMATIONInfo;
      CRM_ACTION_INFORMATIONInfo = await this.starServices.execSQL(this, sqlStmt);
      console.log("testing CRM_ACTION_INFORMATIONInfo:", CRM_ACTION_INFORMATIONInfo);
      if (this.FORM_TRIGGER_FAILURE == true) {
        return retVal;
      }
      else {
        if (CRM_ACTION_INFORMATIONInfo.length != 0) { //FOUND
          w_spdate = CRM_ACTION_INFORMATIONInfo[0]["APPDATE"];

        }
      }
      w_sysdate = this.GET_DATE();
      today = w_sysdate;
      sp_appdate = sp_appdate;

      avlcnt = 0;
       sqlStmt = "SELECT COUNT(*)  AVLCNT "
        //INTO avlcnt
        + "     FROM CRM_ACTION_FUNCTION "
        + "     WHERE SUBSCR_TYPE = '" + sp_subtype + "'"
        + "     AND AREA          = '" + sp_area + "'"
        + "     AND SUBNO          = '" + sp_subno + "'"
        + "     AND SERORDNO      = '" + xsp_serordno + "'"
        + "     AND WOTYPE        = 'E' "
        + "     AND STATUS        = 30 ";

      let CRM_ACTION_FUNCTIONnfo;
      CRM_ACTION_FUNCTIONnfo = await this.starServices.execSQL(this, sqlStmt);
      console.log("testing CRM_ACTION_FUNCTIONnfo:", CRM_ACTION_FUNCTIONnfo);
      if (this.FORM_TRIGGER_FAILURE == true) {
        return retVal;
      }
      else {
        if (CRM_ACTION_FUNCTIONnfo.length != 0) { //FOUND
          avlcnt = CRM_ACTION_FUNCTIONnfo[0]["AVLCNT"];
        }
      }
      let out_errorcode = "";
      if (sp_appdate > today) {
        if (this.nvl(avlcnt, 0) <= 0) {
          sqlStmt = "UPDATE CRM_ACTION_FUNCTION "
            + "     SET STATUS        =  30, "
            + "     DISPTO            = 'SPC' "
            + "     WHERE SUBSCR_TYPE = '" + sp_subtype + "'"
            + "     AND AREA          = '" + sp_area + "'"
            + "     AND SUBNO         = '" + sp_subno + "'"
            + "     AND SERORDNO      = '" + xsp_serordno + "'"
            + "     AND WOTYPE        = 'E' ";
          out_errorcode = '017';
        }
        else {
          if (this.nvl(avlcnt, 0) <= 0) {
            sqlStmt = "UPDATE CRM_ACTION_FUNCTION "
              + "     SET STATUS        =  30, "
              + "     DISPTO            = 'SPC' "
              + "     DISPWAY            = 'SPC' "
              + "     WHERE SUBSCR_TYPE = '" + sp_subtype + "'"
              + "     AND AREA          = '" + sp_area + "'"
              + "     AND SUBNO         = '" + sp_subno + "'"
              + "     AND SERORDNO      = '" + xsp_serordno + "'"
              + "     AND WOTYPE        = 'E' ";
          }
        }
        if (sqlStmt != "") {
          CRM_ACTION_FUNCTIONnfo = await this.starServices.execSQL(this, sqlStmt);
        }


      }


      //////                   


      retVal.out_errorcode = '001';
      retVal.out_function = sp_function;
      retVal.out_system = sp_system;
      retVal.out_portno = sp_portno;



    }
    return (retVal);

    //retval = spcerror,spcfunction,w_system, portno,anyerror


  }
  public spchk_org() {
    /*   
      PROCEDURE spchk
      (sp_sotype                NUMBER,
       sp_subtype               VARCHAR2,
       sp_area                  VARCHAR2,
       sp_subno                 VARCHAR2,
       sp_serordno              VARCHAR2,
       sp_exc                   VARCHAR2,
       sp_equipid               VARCHAR2,
       sp_equip_ordertype       VARCHAR2,
       out_errorcode      OUT   VARCHAR2,
       out_function       OUT   VARCHAR2,
       out_system         OUT   VARCHAR2,
       out_portno         OUT   VARCHAR2,
       sp_type_id               VARCHAR2,
       sp_excold                VARCHAR2,
       anyerror           OUT   VARCHAR2) IS
       w_spdate date;
       dummy          VARCHAR2(1);
       avlcnt         NUMBER(7);
       sp_system      VARCHAR2(15);
       sp_portno      VARCHAR2(8);
       sp_function    VARCHAR2(4);
       today          VARCHAR2(10);
       sp_appdate     VARCHAR2(10);
       xsp_sotype     NUMBER(4);
       xsp_serordno   VARCHAR2(4);
    w_sysdate date;
    BEGIN
    
    
    anyerror      := null;
    xsp_sotype    := sp_sotype;
    xsp_serordno  := sp_serordno;
    IF SUBSTR(TO_CHAR(sp_sotype),1,4) not in('LTST','METR') THEN
    IF SUBSTR(sp_equipid,1,1) != ' ' AND SUBSTR(sp_equip_ordertype,1,4)='INST' THEN
        IF SUBSTR(sp_type_id,1,4) ='ROAM' THEN
           sp_function  := 'ROIN';
        ELSE
           sp_function  := 'SERI';
        END IF;
    ELSIF SUBSTR(sp_equipid,1,1) != ' ' AND SUBSTR(sp_equip_ordertype,1,4)='DISC' THEN
           sp_function  := 'SERD';
    ELSIF SUBSTR(sp_equipid,1,1) != ' ' THEN
           sp_function  := 'SERI';
    ELSIF ( xsp_sotype= 10 or xsp_sotype = 20 or
           xsp_sotype= 22 or xsp_sotype = 60  or
           xsp_sotype= 62) THEN
        IF SUBSTR(sp_type_id,1,4)='ROAM' THEN
           sp_function  := 'ROIN';
        ELSE
           sp_function  := 'INST';
        END IF;
    ELSIF ( xsp_sotype =63 and sp_subtype ='M') THEN
           sp_function  := 'SPCH';
    ELSIF ( xsp_sotype=63 and  sp_subtype ='P') THEN
           sp_function  := 'TERM';
    ELSIF ( xsp_sotype=63 and  sp_subtype ='G') THEN
           sp_function  := 'INST';
    ELSIF ( xsp_sotype = 21 or xsp_sotype = 23 or
           xsp_sotype = 50 or xsp_sotype = 55) THEN
           sp_function  := 'TERM';
    ELSIF ( xsp_sotype = 30) THEN
           sp_function  := 'CONP';
    ELSIF ( xsp_sotype = 40)  THEN
           sp_function  := 'DINP';
    ELSIF ( xsp_sotype = 13)  THEN
           sp_function  := 'WANP';
    ELSIF ( xsp_sotype =32 or xsp_sotype = 35) THEN
           sp_function  := 'CONN';
    ELSIF ( xsp_sotype =42 or xsp_sotype = 45) THEN
           sp_function  := 'DISC';
    
    ELSIF ( xsp_sotype = 43 or xsp_sotype = 44 )  THEN
           sp_function  := 'BAOC';
    ELSIF ( xsp_sotype = 33 )  THEN
           sp_function  := 'CONB';
    
    ELSE
         out_errorcode  := '011';
         GOTO ABORT_PROCESS;
    END IF;
    ELSE
              xsp_sotype    := 0;
              xsp_serordno  := null;
              sp_function   := SUBSTR(TO_CHAR(sp_sotype),1,4);
    END IF;
    BEGIN
    sp_system    := null;
    sp_portno    := null;
    SELECT SYSTEM, SLMC INTO sp_system, sp_portno  FROM CRM_EXCHANGE
    WHERE AREA = sp_area
    AND EXC    = sp_exc;
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
       sp_portno := '****';
       out_errorcode := '013';
       GOTO ABORT_PROCESS;
    WHEN TOO_MANY_ROWS THEN NULL;
    WHEN OTHERS THEN
       sp_portno := '****';
       anyerror := 'ERROR SELECTING CRM_EXC : ' || TO_CHAR(sqlcode);
       out_errorcode := '013';
       GOTO ABORT_PROCESS;
    END;
    IF SUBSTR(sp_portno,1,1) is null or
      SUBSTR(sp_portno,1,1) =' ' THEN
      out_errorcode  := '012';
    END IF;
    BEGIN
     dummy   := null;
     SELECT 'X' INTO dummy
     FROM EIM_COMMANDS
     WHERE SPC_FUNCTION = sp_function
     AND EXCSYSTEM      = sp_system AND
     ( equipid = sp_equipid or equipid is null)
     AND CMDNO          = 1
     AND PARAMNO        = 1;
    EXCEPTION
     WHEN NO_DATA_FOUND THEN NULL;
     WHEN TOO_MANY_ROWS THEN NULL;
     WHEN OTHERS THEN
     out_errorcode   := '014';
     GOTO ABORT_PROCESS;
    END;
    IF SUBSTR(to_char(sp_sotype),1,4) not in('LTST','METR') THEN
         BEGIN
           today       := null;
           sp_appdate  := null;
           SELECT APPDATE INTO w_spdate FROM CRM_ACTION_INFORMATION
           WHERE SUBSCR_TYPE    = sp_subtype
           AND AREA             = sp_area
           AND SUBNO            = sp_subno
           AND SERORDNO         = xsp_serordno;
           select sysdate into w_sysdate from dual;
           today := to_char(w_sysdate,'YYYY-MM-DD');
           sp_appdate := to_char(w_spdate,'YYYY-MM-DD');
         EXCEPTION
           WHEN NO_DATA_FOUND THEN NULL;
           WHEN TOO_MANY_ROWS THEN NULL;
         END;
       BEGIN
         avlcnt := 0;
         SELECT COUNT(*) INTO avlcnt
         FROM CRM_ACTION_FUNCTION
         WHERE SUBSCR_TYPE = sp_subtype
         AND AREA          = sp_area
         AND SUBNO         = sp_subno
         AND SERORDNO      = xsp_serordno
         AND WOTYPE        = 'E'
         AND STATUS        = 30;
       EXCEPTION
         WHEN OTHERS THEN
         anyerror := 'SOME ERROR OCCURED IN WORDORDER : ' || TO_CHAR(sqlcode);
         GOTO ABORT_PROCESS;
       END;
    IF sp_appdate > today THEN
         IF NVL(avlcnt,0) <=0 THEN
           BEGIN
           UPDATE CRM_ACTION_FUNCTION
           SET STATUS        =  30,
           DISPTO            = 'SPC'
           WHERE SUBSCR_TYPE = sp_subtype
           AND AREA          = sp_area
           AND SUBNO         = sp_subno
           AND SERORDNO      = xsp_serordno
           AND WOTYPE        = 'E';
           EXCEPTION
           WHEN OTHERS THEN
           out_errorcode    := '015';
           GOTO ABORT_PROCESS;
           END;
         END IF;
           out_errorcode    := '017';
           GOTO ABORT_PROCESS;
    ELSE
       IF NVL(avlcnt,0) <=0 THEN
           BEGIN
           UPDATE CRM_ACTION_FUNCTION
           SET STATUS        = 30,
           DISPTO            = 'SPC',
           DISPWAY           = 'SPC'
           WHERE SUBSCR_TYPE = sp_subtype
           AND AREA          = sp_area
           AND SUBNO         = sp_subno
           AND SERORDNO      = xsp_serordno
           AND WOTYPE        = 'E';
           EXCEPTION
           WHEN OTHERS THEN
           out_errorcode    := '015';
           GOTO ABORT_PROCESS;
           END;
       END IF;
    END IF;
    END IF;
           out_errorcode         := '001';
           out_function          := sp_function;
           out_system            := sp_system;
           out_portno            := sp_portno;
    <<ABORT_PROCESS>>
    NULL;
    END;
    */
  }
  public SPCIN(sp_sotype, sp_subtype, sp_area, sp_subno, sp_serordno, sp_exc, sp_equipid, sp_function, sp_system, sp_portno, sp_esnno_ch, sp_type_id, sp_excold, old_type_id, old_cardno) {
    let retVal = {
      sp_subno: "",
      sp_exc: "",
      sp_function: "",
      sp_system: "",
      sp_portno: "",
      out_error: "",
      anyerror: "",
      return_status: ""
    }
    let NewSubno, VS, SUCCESS, FAIL, sp_stat, sp_exctemp, sp_paramno, p_equipid, sp_subtype2, sp_area2, sp_subno2, sp_appdate,
      sp_devtype, sp_devno, sp_devno_ch, sp_a4ki, old_devno, sp_esnno_hex_ch, hn_roam_subno, hn_roam_area, hn_freq,
      hn_ric, hn_esn_msc, hn_function_bit, hn_baudrate, hn_numalfa, hn_subnolength, hn_arealength, sp_transno,
      sp_transno2, sp_cmdno, sp_timeout, sp_param, sp_cmdtxt, oldcmdno, oldtimeout, sp_command, old_devno_ch,
      hn_contrno, sp_plength, p_count, v_equipid, v_subno, sp_v_subno, w_spcfunction, sp_Address, sp_Subject,
      sp_Body, sp_Attach, sp_OrderNo;
    retVal.sp_function = sp_function;
    retVal.sp_system = sp_system;
    retVal.sp_portno = sp_portno;

    NewSubno = sp_subno;
    return retVal;
  }
  public SPCIN_ORG() {
    /*
    PROCEDURE SPCIN
  (sp_sotype           IN       NUMBER,
   sp_subtype          IN       VARCHAR2,
   sp_area             IN       VARCHAR2,
   sp_subno            IN OUT   VARCHAR2,
   sp_serordno         IN       VARCHAR2,
   sp_exc              IN OUT   VARCHAR2,
   sp_equipid          IN       VARCHAR2,
   sp_function         IN OUT   VARCHAR2,
   sp_system           IN OUT   VARCHAR2,
   sp_portno           IN       VARCHAR2,
   out_error           OUT      VARCHAR2,
   sp_esnno_ch         IN       VARCHAR2,
   sp_type_id          IN       VARCHAR2,
   sp_excold           IN       VARCHAR2,
   old_type_id         IN       VARCHAR2,
   old_cardno          IN       VARCHAR2,
   anyerror            IN OUT   VARCHAR2,
   return_status       OUT      NUMBER) IS
  
   --NewSubno                     VARCHAR2(10);
   NewSubno                     VARCHAR2(20):=sp_subno; -- Add By Tarek Abul Naga
   VS                           NUMBER(5);
   SUCCESS                      NUMBER(1);
   FAIL                         NUMBER(1);
   sp_stat                      NUMBER(2);
   sp_exctemp                   VARCHAR2(4);
   sp_paramno                   NUMBER(2);
   p_equipid                    VARCHAR2(10);
   sp_subtype2                  VARCHAR2(1);
   sp_area2                     VARCHAR2(4);
   sp_subno2                    VARCHAR2(20);
   sp_appdate                   VARCHAR2(10);
   sp_devtype                   VARCHAR2(4);
   sp_devno                     NUMBER;
   sp_devno_ch                  VARCHAR2(10);
   sp_a4ki		      varchar2(32);
   old_devno                    NUMBER;
   sp_esnno_hex_ch              VARCHAR2(8);
   hn_roam_subno                VARCHAR2(20);
   hn_roam_area                 VARCHAR2(4);
   hn_freq                      VARCHAR2(1);
   hn_ric                       VARCHAR2(8);
   hn_esn_msc                   VARCHAR2(12);
   hn_function_bit              VARCHAR2(1);
   hn_baudrate                  VARCHAR2(1);
   hn_numalfa                   VARCHAR2(1);
   hn_subnolength               NUMBER;
   hn_arealength                NUMBER;
   sp_transno                   NUMBER;
   sp_transno2                  NUMBER;
   sp_cmdno                     NUMBER;
   sp_timeout                   NUMBER;
   sp_param                     VARCHAR2(15);
   sp_cmdtxt                    VARCHAR2(4000);
   oldcmdno                     NUMBER;
   oldtimeout                   NUMBER;
   sp_command                   VARCHAR2(4000);
   old_devno_ch                 VARCHAR2(10);
   hn_contrno                   VARCHAR2(10);
   sp_plength                   NUMBER;
   p_count                      NUMBER;
   v_equipid                    VARCHAR2(10);
   v_subno                      VARCHAR2(20);
   sp_v_subno                   varchar2(20);
   w_spcfunction      varchar2(10);
   sp_Address varchar2(30);
   sp_Subject varchar2(30);
   sp_Body    varchar2(30);
   sp_Attach  varchar2(30);
   sp_OrderNo  varchar2(30);
  
   CURSOR funccur IS
      SELECT CMDNO,TIMEOUT,CMDTXT,PARAM_FIELD,PARAMNO,PARAM_LENGTH
      FROM EIM_COMMANDS
      WHERE
      (SPC_FUNCTION       = sp_function  OR
       SPC_FUNCTION       = w_spcfunction) AND
      EXCSYSTEM                 = sp_system AND
      ( EQUIPID = sp_equipid or EQUIPID is null)
      ORDER BY CMDNO,PARAMNO;
   BEGIN
    if sp_function = 'INST' then
       w_spcfunction := 'SERI';
    elsif sp_function = 'ROIN' then
       w_spcfunction := 'SERI';
    elsif sp_function = 'TERM' then
       w_spcfunction := 'SERD';
    end if;
  
   sp_transno  := NULL;
   sp_transno2 := NULL;
   SUCCESS     := 1;
   FAIL        := 0;
   IF SUBSTR(TO_CHAR(sp_sotype),1,4) NOT IN('LTST','METR') THEN       //  1.1 
  
   SPCIN_BDY.get_serorder (sp_area,sp_subno,sp_subtype,sp_serordno,
    anyerror,sp_subtype2,sp_area2,sp_subno2,
     sp_appdate);
  
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
  anyerror);
  out_error     := '016';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF sp_sotype IN(32,35) THEN
  IF (sp_subtype = 'P') THEN
  sp_stat := 40;
  SPCIN_BDY.get_ric(sp_subtype,sp_type_id,sp_esnno_ch,anyerror,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_baudrate,
     hn_numalfa,hn_contrno,hn_subnolength,hn_arealength);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
           anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  END IF;
  IF (sp_sotype = 60 AND                              // 1.2  
  SUBSTR(sp_function,1,3) !='SER' AND
  sp_equipid is null )THEN
  sp_exctemp     := SUBSTR(sp_exc,1,4);
  sp_exc         := SUBSTR(sp_excold,1,4);
  BEGIN
  SELECT SYSTEM INTO sp_system
  FROM   CRM_EXCHANGE
  WHERE  EXC = sp_exc;
  EXCEPTION
  WHEN NO_DATA_FOUND THEN NULL;
  WHEN TOO_MANY_ROWS THEN NULL;
  WHEN OTHERS        THEN
  out_error     := '099';
  return_status := 0;
  RETURN;
  END;
  sp_function :=  'NUTR';
  IF (sp_subtype ='P') THEN
  sp_stat  := 30;
  SPCIN_BDY.get_ric(sp_subtype,sp_type_id,sp_esnno_ch,anyerror,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_baudrate,
     hn_numalfa,hn_contrno,hn_subnolength,hn_arealength);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  IF (sp_subtype = 'G') THEN
  sp_stat := 30;
  SPCIN_BDY.get_imsino(sp_type_id,sp_esnno_ch,anyerror,
        sp_devno,sp_devno_ch,sp_a4ki);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  IF (sp_subtype = 'M') THEN
  sp_stat := 30;
  SPCIN_BDY.get_esnno(sp_esnno_ch,sp_type_id,anyerror,sp_esnno_hex_ch);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '026';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF SUBSTR(sp_type_id,1,4) ='ROAM' THEN
  SPCIN_BDY.get_roamno(sp_esnno_ch,sp_subno,sp_area,anyerror,
          hn_roam_subno,hn_roam_area);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
          anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '027';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  END IF;
  OPEN funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
   sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF funccur%NOTFOUND THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.get_transno2(sp_transno2,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  out_error     := '020';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.ins_spc_trans2(sp_subtype2,sp_area2,sp_subno2,sp_function,sp_serordno,
          sp_transno2,sp_exc,sp_system,sp_portno,sp_devtype,
          sp_devno,sp_equipid,sp_sotype,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  out_error     := '021';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,oldtimeout,sp_command);
  LOOP
  SPCIN_BDY.build_cmd(sp_subtype,sp_param,p_equipid,sp_cmdtxt,sp_command,
     sp_subno,sp_devno_ch,old_devno_ch,sp_esnno_hex_ch,
     hn_roam_subno,hn_roam_area,sp_devtype,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_numalfa,
     sp_area,hn_arealength,hn_contrno,sp_plength,
     V_EQUIPID,anyerror,V_SUBNO,P_COUNT,
     hn_baudrate,sp_a4ki,sp_esnno_ch,sp_type_id,sp_v_subno,
     sp_Address,sp_Subject,sp_Body,sp_Attach,sp_OrderNo, Sp_EquipID); 
        
  
  --            SELECT NVL(LENGTH(sp_subno), 0) INTO VS FROM DUAL;
  vs := NVL(LENGTH(sp_subno), 0);
  sp_subno := SUBSTR(Newsubno,1,VS);
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  IF (funccur%NOTFOUND or sqlcode !=0) THEN
  EXIT;
  ELSE
  IF (sp_cmdno != oldcmdno) THEN
  SPCIN_BDY.ins_cmd2(sp_transno2,oldcmdno,sp_command,oldtimeout,
           anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                     sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,
               oldtimeout,sp_command);
  END IF;
  END IF;
  END LOOP;
  SPCIN_BDY.ins_cmd2(sp_transno2,oldcmdno,sp_command,oldtimeout,
    anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  CLOSE funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '023';
  return_status := SUCCESS;
  RETURN;
  END IF; 
  IF substr(sp_type_id,1,4) ='ROAM' THEN
  sp_function := 'ROIN';
  ELSE
  sp_function := 'NUIN';
  END IF;
  sp_exc      := SUBSTR(sp_exctemp,1,4);
  BEGIN
  SELECT SYSTEM INTO sp_system FROM CRM_EXCHANGE
  WHERE EXC = sp_exc;
  EXCEPTION
  WHEN NO_DATA_FOUND THEN NULL;
  WHEN TOO_MANY_ROWS THEN NULL;
  END;
  END IF;                        //  1.2 
  IF  (sp_sotype in(63,62)              AND   //1.3 
  sp_subtype in('P','G')           AND
  SUBSTR(sp_function,1,3) !='SER'  AND
  sp_equipid is null) THEN
  sp_function  := 'SPTR';
  IF (sp_subtype='P' AND sp_sotype=63) THEN
  sp_stat := 40;
  SPCIN_BDY.get_ric(sp_subtype,sp_type_id,sp_esnno_ch,anyerror,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_baudrate,
     hn_numalfa,hn_contrno,hn_subnolength,hn_arealength);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
             anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  IF (sp_subtype='G') THEN
  sp_stat := 40;
  SPCIN_BDY.get_oldimsino(old_type_id,old_cardno,anyerror,old_devno,
           old_devno_ch);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
          anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '024';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  OPEN funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF funccur%NOTFOUND THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.get_transno2(sp_transno2,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '020';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF (sp_sotype = 62) THEN
  SPCIN_BDY.ins_spc_trans_cach(sp_subtype,sp_area,sp_subno,
                sp_transno2,sp_exc,sp_system,
                sp_portno,sp_function,sp_equipid,sp_sotype,
                anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '021';
  return_status := SUCCESS;
  RETURN;
  END IF;
  ELSIF(sp_sotype = 63) THEN
  SPCIN_BDY.ins_spc_trans_spch(sp_subtype,sp_area,sp_subno,
                sp_transno2,sp_exc,sp_system,
                sp_portno,sp_function,sp_equipid,
                sp_excold,sp_sotype,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  out_error     := '021';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,oldtimeout,
   sp_command);
  LOOP
  SPCIN_BDY.build_cmd(sp_subtype,sp_param,p_equipid,sp_cmdtxt,sp_command,
     sp_subno,sp_devno_ch,old_devno_ch,sp_esnno_hex_ch,
     hn_roam_subno,hn_roam_area,sp_devtype,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_numalfa,
     sp_area,hn_arealength,hn_contrno,sp_plength,
     V_EQUIPID,anyerror,V_SUBNO,P_COUNT,
     hn_baudrate,sp_a4ki,sp_esnno_ch,sp_type_id,sp_v_subno,
     sp_Address,sp_Subject,sp_Body,sp_Attach,sp_OrderNo, Sp_EquipID);
  
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF (funccur%NOTFOUND or sqlcode !=0) THEN
  EXIT;
  ELSE
  IF (sp_cmdno != oldcmdno) THEN
  SPCIN_BDY.ins_cmd2(sp_transno2,oldcmdno,sp_command,
           oldtimeout,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                     sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,
               oldtimeout,sp_command);
  END IF;
  END IF;
  END LOOP;
  sp_command := substr(sp_command,1,4000);
  SPCIN_BDY.ins_cmd2(sp_transno2,oldcmdno,sp_command,
     oldtimeout,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  CLOSE funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '023';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF SUBSTR(sp_type_id,1,4) = 'ROAM' THEN
  sp_function    :=  'ROIN';
  ELSE
  sp_function    :=  'SPIN';
  END IF;
  END IF;  // 1.3 
  OPEN funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
   sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF funccur%NOTFOUND THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  
  IF (SUBSTR(sp_function,1,4)
  in('INST','ROIN','TERM','NUTR','NUIN','SPTR','WANP',
  'SPIN','CONP','DINP','CONN','DISC','SPCH','BAOC','CONB') OR      
  SUBSTR(sp_function,1,3) in('SER')) THEN   // 1.4 
  IF (sp_sotype = 60) THEN      // 1.4.1 
  IF (sp_subtype='G') THEN
  SPCIN_BDY.get_imsino(sp_type_id,sp_esnno_ch,anyerror,
             sp_devno,sp_devno_ch,sp_a4ki);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
              sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '024';
  return_status := SUCCESS;
  RETURN;
  END IF;
  ELSIF (sp_subtype = 'P') THEN
  sp_stat  := 30;
  SPCIN_BDY.get_ric(sp_subtype,sp_type_id,sp_esnno_ch,anyerror,
         hn_freq,hn_ric,hn_esn_msc,hn_function_bit,
         hn_baudrate,hn_numalfa,hn_contrno,
         hn_subnolength,hn_arealength);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
               sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  ELSIF (sp_subtype = 'M') THEN
  sp_stat  := 30;
  SPCIN_BDY.get_esnno(sp_esnno_ch,sp_type_id,anyerror,
              sp_esnno_hex_ch);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                 sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '026';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF SUBSTR(sp_type_id,1,4) ='ROAM' THEN
  SPCIN_BDY.get_roamno(sp_esnno_ch,sp_subno,sp_area,anyerror,
                  hn_roam_subno,hn_roam_area);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                     sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '027';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  ELSE
  SPCIN_BDY.get_spcdnuch(sp_area2,sp_subno2,sp_subtype2,
                 anyerror,sp_devtype,sp_devno,sp_devno_ch);
  IF anyerror IS NOT NULL THEN
  IF SUBSTR(sp_devtype,1,4)='****' THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                   sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '018';
  return_status := SUCCESS;
  RETURN;
  ELSE
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                   sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '019';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  END IF;
  ELSE
  IF (sp_subtype = 'G') THEN
  SPCIN_BDY.get_imsino(sp_type_id,sp_esnno_ch,anyerror,
                sp_devno,sp_devno_ch,sp_a4ki);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                 sp_serordno,anyerror);
  out_error     := '024';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  IF (sp_subtype = 'P') THEN
  IF (sp_sotype = 63) THEN
  sp_stat := 30;
  ELSE
  IF SUBSTR(sp_function,1,4) in('INST','NUIN') THEN
  sp_stat := 30;
  ELSE
  sp_stat := 40;
  END IF;
  END IF;
  SPCIN_BDY.get_ric(sp_subtype,sp_type_id,sp_esnno_ch,anyerror,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_baudrate,
     hn_numalfa,hn_contrno,hn_subnolength,hn_arealength);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,
                  sp_serordno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '025';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  IF (sp_subtype = 'M') THEN  // 1.4.2 
  IF (sp_sotype = 63) THEN
  sp_stat := 30;
  ELSE
  IF SUBSTR(sp_function,1,4) in('INST','NUIN') THEN
  sp_stat := 30;
  ELSE
  sp_stat := 40;
  END IF;
  END IF;
  SPCIN_BDY.get_esnno(sp_esnno_ch,sp_type_id,anyerror,
            sp_esnno_hex_ch);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
             anyerror);
  out_error     := '026';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF SUBSTR(sp_type_id,1,4) ='ROAM' THEN
  SPCIN_BDY.get_roamno(sp_esnno_ch,sp_subno,sp_area,anyerror,
                hn_roam_subno,hn_roam_area);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
                   anyerror);
  out_error     := '027';
  return_status := SUCCESS;
  RETURN;
  END IF;
  ELSE
  SPCIN_BDY.get_spcdev(sp_area,sp_subno,sp_subtype,
                anyerror,sp_devtype,sp_devno,
                sp_devno_ch);
  IF anyerror IS NOT NULL THEN
  IF SUBSTR(sp_devtype,1,4)='****' THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
                    anyerror);
  out_error     := '018';
  return_status := SUCCESS;
  RETURN;
  ELSE
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
                    anyerror);
  out_error     := '019';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;
  END IF;
  END IF;  // 1.4.2 
  END IF; // 1.4.1 
  END IF;   // 1.4 
  SPCIN_BDY.get_transno(sp_transno,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '020';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.ins_spc_trans(sp_subtype,sp_area,sp_subno,sp_function,
        sp_serordno,sp_transno,sp_exc,sp_system,
        sp_portno,sp_devtype,sp_devno,sp_equipid,
        sp_sotype,anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
        anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '021';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,
  oldtimeout,sp_command);
  LOOP
  SPCIN_BDY.build_cmd(sp_subtype,sp_param,p_equipid,sp_cmdtxt,sp_command,
     sp_subno,sp_devno_ch,old_devno_ch,sp_esnno_hex_ch,
     hn_roam_subno,hn_roam_area,sp_devtype,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_numalfa,
     sp_area,hn_arealength,hn_contrno,sp_plength,
     V_EQUIPID,anyerror,V_SUBNO,P_COUNT,
     hn_baudrate,sp_a4ki,sp_esnno_ch,sp_type_id,sp_v_subno,
     sp_Address,sp_Subject,sp_Body,sp_Attach,sp_OrderNo, Sp_EquipID);
  
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF (funccur%NOTFOUND or sqlcode !=0) THEN
  EXIT;
  ELSE
  IF (sp_cmdno != oldcmdno) THEN
  SPCIN_BDY.ins_cmd(sp_transno,oldcmdno,sp_command,oldtimeout,
               anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
                     anyerror);
  SPCIN_BDY.rollb_spc(sp_transno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,
               oldtimeout,sp_command);
  END IF;
  END IF;
  END LOOP;
  SPCIN_BDY.ins_cmd(sp_transno,oldcmdno,sp_command,oldtimeout,
    anyerror);
  IF anyerror IS NOT NULL THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
          anyerror);
  SPCIN_BDY.rollb_spc(sp_transno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  CLOSE funccur;
  IF (sqlcode !=0) THEN
  SPCIN_BDY.rollb_work(sp_subtype,sp_area,sp_subno,sp_serordno,
         anyerror);
  SPCIN_BDY.rollb_spc(sp_transno,anyerror);
  SPCIN_BDY.rollb_spc2(sp_transno2,anyerror);
  out_error     := '023';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF sp_sotype IN(21,23) THEN
  out_error := '005';
  ELSIF sp_sotype IN(20,22) THEN
  out_error := '006';
  ELSE
  out_error     := '002';
  return_status := SUCCESS;
  RETURN;
  END IF;
  ELSE                                      // 1.1 
  OPEN funccur;
  IF (sqlcode !=0) THEN
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF funccur%NOTFOUND THEN
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  IF (sqlcode !=0) THEN
  out_error     := '014';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.get_transno(sp_transno,anyerror);
  IF anyerror IS NOT NULL THEN
  out_error     := '020';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.ins_spc_trans(sp_subtype,sp_area,sp_subno,sp_function,
        sp_serordno,sp_transno,sp_exc,sp_system,
        sp_portno,sp_devtype,sp_devno,sp_equipid,
        sp_sotype,anyerror);
  IF anyerror IS NOT NULL THEN
  out_error     := '021';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,oldtimeout,
   sp_command);
  LOOP
  SPCIN_BDY.build_cmd(sp_subtype,sp_param,p_equipid,sp_cmdtxt,sp_command,
     sp_subno,sp_devno_ch,old_devno_ch,sp_esnno_hex_ch,
     hn_roam_subno,hn_roam_area,sp_devtype,hn_freq,
     hn_ric,hn_esn_msc,hn_function_bit,hn_numalfa,
     sp_area,hn_arealength,hn_contrno,sp_plength,
     V_EQUIPID,anyerror,V_SUBNO,P_COUNT,
     hn_baudrate,sp_a4ki,sp_esnno_ch,sp_type_id,sp_v_subno,
     sp_Address,sp_Subject,sp_Body,sp_Attach,sp_OrderNo, Sp_EquipID);
  
  FETCH funccur INTO sp_cmdno,sp_timeout,sp_cmdtxt,sp_param,
    sp_paramno,sp_plength;
  sp_cmdtxt := replace(sp_cmdtxt,'~');
  
  IF (funccur%NOTFOUND or sqlcode !=0) THEN
  EXIT;
  ELSE
  IF (sp_cmdno != oldcmdno) THEN
  SPCIN_BDY.ins_cmd(sp_transno,oldcmdno,sp_command,oldtimeout,
               anyerror);
  IF anyerror IS NOT NULL THEN
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  SPCIN_BDY.new_cmd(sp_cmdno,sp_timeout,oldcmdno,
               oldtimeout,sp_command);
  END IF;
  END IF;
  END LOOP;
  SPCIN_BDY.ins_cmd(sp_transno,oldcmdno,sp_command,oldtimeout,
    anyerror);
  IF anyerror IS NOT NULL THEN
  out_error     := '022';
  return_status := SUCCESS;
  RETURN;
  END IF;
  CLOSE funccur;
  IF (sqlcode !=0) THEN
  out_error     := '023';
  return_status := SUCCESS;
  RETURN;
  END IF;
  END IF;                              // 1.1 
  END;
  
    */
  }
  public trunc(inDate) {
    let paramConfig = getParamConfig();
    //let outDate = formatDate(inDate, paramConfig.DateFormat,  paramConfig.dateLocale);
    console.log("bug trunc: inDate:", inDate)
    let outDate = getDate(inDate);
    console.log("bug trunc: outDate:", outDate)
    return outDate;
  }
  public get_sequence(seq_name) {

    this.FORM_TRIGGER_FAILURE = false;
    console.log("bug get seq_name:", seq_name);
    return new Promise(resolve => {
      let Page = "&_trans=Y";
      this.Body = [];
      let NewVal = {};
      let sqlStmt = "update SEQUENCES "
        + "   set seq_value = seq_value +1 "
        + "   where seq_name =  '" + seq_name.toUpperCase() + "'";
      NewVal["_QUERY"] = "GET_STMT";
      NewVal["_STMT"] = sqlStmt;
      this.addToBody(NewVal);
      NewVal = {};
      sqlStmt = "select SEQ_VALUE "
        + "   from SEQUENCES "
        + "   where seq_name =  '" + seq_name.toUpperCase() + "'";

      NewVal["_QUERY"] = "GET_STMT";
      NewVal["_STMT"] = sqlStmt;
      this.addToBody(NewVal);
      this.starServices.post(this, Page, this.Body).subscribe(result => {
        this.Body = [];
        let SEQUENCESInfo = result.data[1];
        console.log("bug result:", result.data, SEQUENCESInfo);
        console.log("bug result.data[1].rowCoun:", result.data[0].rowCount)
        if (SEQUENCESInfo.rowCount != 0) { //FOUBD
          this.FORM_TRIGGER_FAILURE = false;
          let SEQ_VALUE = SEQUENCESInfo.data[0]["SEQ_VALUE"];
          console.log("bug SEQ_VALUE:", SEQ_VALUE);
          return resolve(SEQ_VALUE);
        }
        else {
          this.FORM_TRIGGER_FAILURE = true;
          alert("Error not able to get sequence:seq_name");
          return resolve(this.FORM_TRIGGER_FAILURE);
        }
      },
        err => {
          this.FORM_TRIGGER_FAILURE = true;
          alert("Error not able to get sequence:seq_name");
          alert('error:' + err.message);
        });
    });
  }


  public get_application_property(object, parameter) {
    console.log("testing parameter:", parameter)
    let value = "";
    if (parameter.toUpperCase() == 'DATASOURCE')
      value = 'MYSQL';
    else if (parameter.toUpperCase() == 'Current_Form')
      value = object.routineName;

    return value;
  }



  async global_program(CHOICE_C, P_Form_Ver) {
    let CompanyProfile_rec;
    let CHOICE_CD = CHOICE_C;
    let b_auth, w_title, vc2_Retailer;
    let wuser = this.starServices.USERNAME;
    let c_Dummy;
    let GLOBAL_WH_CODE, GLOBAL_PRINTER_1, GLOBAL_PRINTER_2;
    let V_PrefValue, sModule;
    let GLOBAL_GROUP;
    let GLOBAL_ROUTINE


    this.starServices.sessionParams["X"] = "";

    this.starServices.sessionParams["GROUP"] = "";
    this.starServices.sessionParams["REP_LANG"] = "";
    this.starServices.sessionParams["IP_ADDRESS"] = "";
    this.starServices.sessionParams["USER_PRINTER_MODE"] = "";
    this.starServices.sessionParams["LANGUAGE_NAME"] = "";      	// Default system language_name set to english(EN)
    this.starServices.sessionParams["REP_LANG"] = "";      	// Default reports language_name set to english(EN)
    this.starServices.sessionParams["USER_LOG"] = "";
    this.starServices.sessionParams["GET_AUTH"] = "";
    this.starServices.sessionParams["FIELD_AUTH"] = "";
    this.starServices.sessionParams["GET_VERSION"] = "";
    this.starServices.sessionParams["HISTORY_LOG"] = "";
    this.starServices.sessionParams["PROMPT_SETTING"] = "";
    this.starServices.sessionParams["USER_LANGUAGE"] = "";
    this.starServices.sessionParams["DISPLAY_VERSION"] = "";
    this.starServices.sessionParams["DEFAULT_AREA"] = "";
    this.starServices.sessionParams["RETCRLIMIT"] = "";
    this.starServices.sessionParams["CHEQUE_TRACE"] = "";
    this.starServices.sessionParams["FLEXI_FIELDS"] = "";
    this.starServices.sessionParams["ROUTINE_NAME"] = "";
    this.starServices.sessionParams["TOOLTIP"] = "";
    this.starServices.sessionParams["PROMPTVS"] = "";
    this.starServices.sessionParams["MANDATORYVS"] = "";
    this.starServices.sessionParams["F_FLDVS"] = "";
    this.starServices.sessionParams["FLD_MANVS"] = "";
    this.starServices.sessionParams["RETAILER"] = "";
    this.starServices.sessionParams["SCREEN_LABEL"] = "";
    this.starServices.sessionParams["ROUTINE_HELPFILE"] = "";
    this.starServices.sessionParams["ACTIVEWINDOW"] = "";
    this.starServices.sessionParams["EVENT_ACTIVITY"] = "";
    this.starServices.sessionParams["PROMPT_CAPTURE"] = "";
    this.starServices.sessionParams["WAREHOUSE"] = "";


    if (this.starServices.sessionParams["WAREHOUSE"] == "") {
      let sqlStmt_Cur_Group = "Select GROUPNAME "
        + "   from ADM_USER_INFORMATION "
        + "   where USERNAME = '" + wuser + "'";
      let ADM_USER_INFORMATIONInfo;
      ADM_USER_INFORMATIONInfo = await this.starServices.execSQL(this, sqlStmt_Cur_Group);
      if (this.FORM_TRIGGER_FAILURE == true) {
        return;
      }
      else {
        if (ADM_USER_INFORMATIONInfo.length != 0) {
          GLOBAL_GROUP = ADM_USER_INFORMATIONInfo[0]["GROUPNAME"];
          this.starServices.sessionParams["GROUP"] = GLOBAL_GROUP;
        }
      }
    }


    if (this.starServices.sessionParams["ROUTINE_NAME"] == "") {
      let sqlStmt_Cur_Routine = "Select ROUTINE_NAME,MODULE "
        + "   from ROUTINES "
        + "   where PROGRAM = '" + CHOICE_C + "'";
      let ROUTINESInfo;
      ROUTINESInfo = await this.starServices.execSQL(this, sqlStmt_Cur_Routine);
      if (this.FORM_TRIGGER_FAILURE == true) {
        return;
      }
      else {
        if (ROUTINESInfo.length != 0) {
          GLOBAL_ROUTINE = ROUTINESInfo[0]["ROUTINE_NAME"];
          sModule = ROUTINESInfo[0]["MODULE"];
          this.starServices.sessionParams["ROUTINE_NAME"] = GLOBAL_ROUTINE;
          this.starServices.sessionParams["ROUTINE_MODULE"] = sModule;
        }
      }
    }
    //Fuad : next 5 queries should be replaced by one query
    let prefNames = " 'PROMPT', 'MANDATORY', 'TOOLTIP' ,  'FLD_MANDATORY' , 'F_FLD' ";

    let sqlStmt_Cur_Prefvalue = "Select PREF_NAME, PREF_VALUE "
      + "   from ADM_USERPREF "
      + "   where PREF_NAME in ( " + prefNames + " )"
      + "   and USERID = '" + wuser + "'";
    let ADM_USERPREFInfo;
    ADM_USERPREFInfo = await this.starServices.execSQL(this, sqlStmt_Cur_Prefvalue);
    if (this.FORM_TRIGGER_FAILURE == true)
      return;
    console.log("testing ADM_USERPREFInfo:", ADM_USERPREFInfo)
    if (ADM_USERPREFInfo.length != 0) {
      for (let i = 0; i < ADM_USERPREFInfo.length; i++) {
        let ADM_USERPREF_rec = ADM_USERPREFInfo[i];
        console.log("testing ADM_USERPREF_rec:", ADM_USERPREF_rec)
        switch (ADM_USERPREF_rec["PREF_NAME"]) {
          case 'PROMPT':
            this.starServices.sessionParams["PROMPTVS"] = ADM_USERPREFInfo[0]["PREF_VALUE"];
            break;
          case 'MANDATORY':
            this.starServices.sessionParams["MANDATORYVS"] = ADM_USERPREFInfo[0]["PREF_VALUE"];
            break;
          case 'TOOLTIP':
            this.starServices.sessionParams["TOOLTIP"] = ADM_USERPREFInfo[0]["PREF_VALUE"];
            break;
          case 'FLD_MANDATORY':
            this.starServices.sessionParams["FLD_MANVS"] = ADM_USERPREFInfo[0]["PREF_VALUE"];
            break;
          case 'F_FLD':
            this.starServices.sessionParams["F_FLDVS"] = ADM_USERPREFInfo[0]["PREF_VALUE"];
            break;
        }
      }
    }



    let parameters = " 'DEFAULT_LANGUAGE', 'REPORT_LANGUAGE', 'ACTIVATE_USER_PRINTER', 'FIELD_AUTH', 'GET_VERSION', 'HISTORY_LOG' "
      + ", 'ENABLE_RET_CRLIMIT', 'DISPLAY_VERSION', 'DEFAULT_AREA', 'SCREEN_LABEL' ";

    let sqlStmt_CompanyProfile_cur = "	SELECT CMP.PARAMETER_NAME, CMP.PARAMETER_VALUE PARAMETER_VALUE "
      + "     FROM		COMPANY_PROFILE	CMP, ADM_SYS		TS "
      + "     WHERE		CMP.PARAMETER_NAME in ( " + parameters + ")"
      + "     AND		CMP.COMPANY_NAME = TS.COMPANY_NAME ";

    let COMPANY_PROFILEInfo;
    this.starServices.sessionParams["USER_LOG"] = 'N';
    this.starServices.sessionParams["HISTORY_LOG"] = 'N';
    this.starServices.sessionParams["RETCRLIMIT"] = 'N';
    this.starServices.sessionParams["DISPLAY_VERSION"] = 'Y';
    this.starServices.sessionParams["DEFAULT_AREA"] = '0';
    this.starServices.sessionParams["SCREEN_LABEL"] = 'Y';
    console.log("testing sqlStmt_CompanyProfile_cur:", sqlStmt_CompanyProfile_cur)
    COMPANY_PROFILEInfo = await this.starServices.execSQL(this, sqlStmt_CompanyProfile_cur);
    if (this.FORM_TRIGGER_FAILURE == true)
      return;
    console.log("testing COMPANY_PROFILEInfo:", COMPANY_PROFILEInfo)
    if (COMPANY_PROFILEInfo.length != 0) {
      for (let i = 0; i < COMPANY_PROFILEInfo.length; i++) {
        CompanyProfile_rec = COMPANY_PROFILEInfo[i];
        console.log("testing CompanyProfile_rec:", CompanyProfile_rec)
        switch (CompanyProfile_rec["PARAMETER_NAME"]) {
          case 'DEFAULT_LANGUAGE':
            this.starServices.sessionParams["LANGUAGE_NAME"] = this.nvl(CompanyProfile_rec["PARAMETER_VALUE"], "EN");
            break;
          case 'REP_LANG':
            this.starServices.sessionParams["REP_LANG"] = this.nvl(CompanyProfile_rec["PARAMETER_VALUE"], "EN");
            break;
          case 'USER_PRINTER_MODE':
            this.starServices.sessionParams["USER_PRINTER_MODE"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'FIELD_AUTH':
            this.starServices.sessionParams["FIELD_AUTH"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'GET_VERSION':
            this.starServices.sessionParams["GET_VERSION"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'USER_LOG':
            this.starServices.sessionParams["USER_LOG"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'HISTORY_LOG':
            this.starServices.sessionParams["HISTORY_LOG"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'RETCRLIMIT':
            this.starServices.sessionParams["RETCRLIMIT"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'DISPLAY_VERSION':
            this.starServices.sessionParams["DISPLAY_VERSION"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'DEFAULT_AREA':
            this.starServices.sessionParams["DEFAULT_AREA"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
          case 'SCREEN_LABEL':
            this.starServices.sessionParams["SCREEN_LABEL"] = CompanyProfile_rec["PARAMETER_VALUE"];
            break;
        }
      }
    }




    if (this.starServices.sessionParams["FIELD_AUTH"] = 'Y') {
      //this.field_auth.init('%',CHOICE_C); // Fuad: Field authority not implemented
    }

    this.starServices.sessionParams["HOSTNAME"] = "";

    //Fuad : title is set in this.starServices.actOnParamConfig
    // if ( this.starServices.sessionParams["USER_LOG"] == 'Y'){
    //   this.put_user_log (CHOICE_CD, this.starServices.sessionParams["ROUTINE_NAME"].toUpperCase(), P_Form_Ver )
    // }
    //Fuad: below need conversion
    // IF Authority.CheckAuthority(choice_c) != Authority.am_OK THEN
    //   DO_AUTH;
    // END IF;
    // if (this.starServices.sessionParams["RETAILER"]  == ""){
    //   this.get_version(w_title,P_Form_Ver); 
    //   this.starServices.sessionParams["RETAILER"] = '   ';
    // }

    if (this.starServices.sessionParams["RETAILER"] == "") {
      let sqlStmt_cRetail = "Select SIGN "
        + "   from 	ADM_USER_INFOrmation,crm_RETAILER_info "
        + "   where USERNAME = '" + wuser + "'"
        + "    AND	SIGN     = RETAILER ";
      let ADM_USER_INFORMATIONInfo;
      ADM_USER_INFORMATIONInfo = await this.starServices.execSQL(this, sqlStmt_cRetail);
      console.log("testing : ADM_USER_INFORMATIONInfo:", ADM_USER_INFORMATIONInfo)
      if (this.FORM_TRIGGER_FAILURE == true) {
        return;
      }
      else {
        if (ADM_USER_INFORMATIONInfo.length != 0) {
          console.log("testing : ADM_USER_INFORMATIONInfo[0]:", ADM_USER_INFORMATIONInfo[0])
          let vc2_Retailer = ADM_USER_INFORMATIONInfo[0]["SIGN"];
          this.starServices.sessionParams["RETAILER"] = vc2_Retailer;
          console.log("seq global programs :", this.starServices.sessionParams["RETAILER"])
        }
        else
          this.starServices.showNotification("error", this.starServices.getNLS([], 'THIS_USER_IS_NOT_A_RETAILER_USER', 'This user is not a retailer user'));
      }
    }
    this.starServices.sessionParams["SYSTEM_USER_ID"] = '';
    this.starServices.sessionParams["WH_CODE"] = '';
    this.starServices.sessionParams["PRINTER_1"] = '';
    this.starServices.sessionParams["PRINTER_2"] = '';
    this.starServices.sessionParams["SYSTEM_USER_ID"] = wuser;

    c_Dummy = this.starServices.sessionParams["SYSTEM_USER_ID"];


    if (this.starServices.sessionParams["WH_CODE"] == "") {
      let sqlStmt_cRFS = "Select WH_CODE,PRINTER_1,PRINTER_2 "
        + "   from ORG_UNITS "
        + "   where  ORG_UNIT_CODE = (SELECT ORG_UNIT_CODE "
        + "    FROM ADM_USERS "
        + "    WHERE USER_ID = '" + wuser + "' )";

      let ORG_UNITSInfo;
      ORG_UNITSInfo = await this.starServices.execSQL(this, sqlStmt_cRFS);
      if (this.FORM_TRIGGER_FAILURE == true) {
        return;
      }
      else {
        if (ORG_UNITSInfo.length != 0) {

          GLOBAL_WH_CODE = ORG_UNITSInfo[0]["WH_CODE"];
          GLOBAL_PRINTER_1 = ORG_UNITSInfo[0]["PRINTER_1"];
          GLOBAL_PRINTER_2 = ORG_UNITSInfo[0]["PRINTER_2"];

          this.starServices.sessionParams["WH_CODE"] = GLOBAL_WH_CODE;
          this.starServices.sessionParams["PRINTER_1"] = GLOBAL_PRINTER_1;
          this.starServices.sessionParams["PRINTER_2"] = GLOBAL_PRINTER_2;
        }
        else
          this.starServices.showNotification("error", this.starServices.getNLS([], 'NO_WAREHOUSE', 'No Warehouse'));
      }
    }

    //Fuad :  PROMPT_CAPTURE & PROMPT_SETTING & FLEXI_FIELDS are not implemented

    console.log(" testing : this.starServices.sessionParams:", this.starServices.sessionParams)
  }
  public global_program_org() {
    /*
    PROCEDURE GLOBAL_PROGRAM (CHOICE_C IN VARCHAR2,p_form_ver in out varchar2 )
   IS
  
    CURSOR CompanyProfile_cur( P_Parameter VARCHAR2) IS
    SELECT	CMP.PARAMETER_VALUE Parameter_Value
    FROM		COMPANY_PROFILE	CMP,
        ADM_SYS		TS
    WHERE		CMP.PARAMETER_NAME = P_Parameter
    AND		CMP.COMPANY_NAME = TS.COMPANY_NAME;
    CompanyProfile_rec CompanyProfile_cur%ROWTYPE;
  
    CHOICE_CD VARCHAR2(20) := CHOICE_C ;
    b_auth NUMBER;
    w_title VARCHAR2(60);
    vc2_Retailer	VARCHAR2(4);
    wuser varchar2(20) := get_user;
    cursor cRetail is
       SELECT	SIGN
    FROM	ADM_USER_INFOrmation,crm_RETAILER_info
    WHERE	USERNAME = wUSER 	AND	SIGN     = RETAILER;
    wRetail cRetail%Rowtype;
  
    cursor userlang is 
    select language_name 
    from adm_user_information
    where username = wuser;
    wuserlang userlang%rowtype;
  
    c_Dummy		VARCHAR2(60);
    GLOBAL_WH_CODE	VARCHAR2(40);
    GLOBAL_PRINTER_1	VARCHAR2(40);
    GLOBAL_PRINTER_2	VARCHAR2(40);
  
    Cursor cRFS is
        SELECT WH_CODE,PRINTER_1,PRINTER_2
           FROM ORG_UNITS
       WHERE ORG_UNIT_CODE = (SELECT ORG_UNIT_CODE
                               FROM ADM_USERS
                              WHERE USER_ID = c_Dummy );
  
    Cursor Cur_Routine is Select
       ROUTINE_NAME,MODULE from ROUTINES where PROGRAM = CHOICE_C;
    GLOBAL_ROUTINE VARCHAR2(40);  
  
    Cursor Cur_Prefvalue (P_Pref_Name Varchar2) is Select PREF_VALUE from
           ADM_USERPREF where PREF_NAME = P_Pref_Name and
           USERID = wuser;
  
    Cursor Cur_Group is Select
       GROUPNAME from ADM_USER_INFORMATION where USERNAME= USER;
    GLOBAL_Group VARCHAR2(8);  
  
  
    V_PrefValue     Varchar2(50);
  sModule varchar2(20);
  
  BEGIN
    DEFAULT_VALUE( '', 'GLOBAL.GROUP');
    DEFAULT_VALUE( '', 'GLOBAL.REP_LANG');			--added by moheb on 1/6/1999
    DEFAULT_VALUE( '', 'GLOBAL.IP_ADDRESS');		--added by moheb on 1/6/1999
    DEFAULT_VALUE( '', 'GLOBAL.USER_PRINTER_MODE');	--added by moheb on 12/07/1999
    DEFAULT_VALUE( '', 'GLOBAL.LANGUAGE_NAME');      	-- Default system language_name set to english(EN)
    DEFAULT_VALUE( '', 'GLOBAL.REP_LANG');      	-- Default reports language_name set to english(EN)
    DEFAULT_VALUE( '', 'GLOBAL.USER_LOG');
    DEFAULT_VALUE( '', 'GLOBAL.GET_AUTH');
    DEFAULT_VALUE( '', 'GLOBAL.FIELD_AUTH');
    DEFAULT_VALUE( '', 'GLOBAL.GET_VERSION');
    DEFAULT_VALUE( '', 'GLOBAL.HISTORY_LOG');
    DEFAULT_VALUE( '', 'GLOBAL.PROMPT_SETTING');
    DEFAULT_VALUE( '', 'GLOBAL.USER_LANGUAGE');
    DEFAULT_VALUE( '', 'GLOBAL.DISPLAY_VERSION');
    DEFAULT_VALUE( '', 'GLOBAL.DEFAULT_AREA');
    DEFAULT_VALUE( '', 'GLOBAL.RETCRLIMIT');
    DEFAULT_VALUE( '', 'GLOBAL.CHEQUE_TRACE');
    DEFAULT_VALUE( '', 'GLOBAL.FLEXI_FIELDS');
    DEFAULT_VALUE( '', 'GLOBAL.ROUTINE_NAME');
    DEFAULT_VALUE( '', 'GLOBAL.TOOLTIP');
    DEFAULT_VALUE( '', 'GLOBAL.PROMPTVS');
    DEFAULT_VALUE( '', 'GLOBAL.MANDATORYVS');
    DEFAULT_VALUE( '', 'GLOBAL.F_FLDVS');
    DEFAULT_VALUE( '', 'GLOBAL.FLD_MANVS');
    DEFAULT_VALUE( '', 'GLOBAL.RETAILER');        -- added by Ram on 13-Jan-2003
    DEFAULT_VALUE( '', 'GLOBAL.SCREEN_LABEL');        -- added by Ram on 11-Mar-2003
    DEFAULT_VALUE( '', 'GLOBAL.ROUTINE_HELPFILE');    -- added by Ram on 12-Mar-2003
    DEFAULT_VALUE( '', 'GLOBAL.ACTIVEWINDOW');    -- added by Ram on 10-May-2003
    DEFAULT_VALUE( '', 'GLOBAL.EVENT_ACTIVITY');
    DEFAULT_VALUE( '', 'GLOBAL.PROMPT_CAPTURE');
    DEFAULT_VALUE( '', 'GLOBAL.WAREHOUSE');
          
    If Name_In('GLOBAL.GROUP') is null Then          -- added by Ram on 13-Jan-2003
       Open Cur_Group;
       Fetch Cur_Group into GLOBAL_GROUP;
       If Cur_Group%found then
             COPY(GLOBAL_GROUP, 'GLOBAL.GROUP');
        End If;
       Close Cur_Group;
    End If;
  
    if name_in('GLOBAL.ROUTINE_NAME') is null then
       Open Cur_Routine;
       Fetch Cur_Routine into GLOBAL_ROUTINE,sModule;
       If Cur_Routine%found then
          COPY(GLOBAL_ROUTINE, 'GLOBAL.ROUTINE_NAME');
          copy(sModule,'Global.Routine_Module');
       END IF;
       Close Cur_Routine;
    end if;
  
  
  
  --  If name_in('GLOBAL.PROMPTVS') is null then
       Open Cur_Prefvalue('PROMPT');
       Fetch Cur_Prefvalue into V_PrefValue;
       If Cur_Prefvalue%FOUND then
          COPY(V_PrefValue, 'GLOBAL.PROMPTVS');
       end if;
       Close Cur_Prefvalue;
  --  end if;
  
  --  If name_in('GLOBAL.MANDATORYVS') is null then
       Open Cur_Prefvalue('MANDATORY');
       Fetch Cur_Prefvalue into V_PrefValue;
       If Cur_Prefvalue%FOUND then
          COPY(V_PrefValue, 'GLOBAL.MANDATORYVS');
       end if;
       Close Cur_Prefvalue;
  --  end if;
  
  --  If name_in('GLOBAL.TOOLTIP') is null then
       Open Cur_Prefvalue('TOOLTIP');
       Fetch Cur_Prefvalue into V_PrefValue;
       If Cur_Prefvalue%FOUND then
          COPY(V_PrefValue, 'GLOBAL.TOOLTIP');
       end if;
       Close Cur_Prefvalue;
  --  end if;
  
  --  If name_in('GLOBAL.FLD_MANVS') is null then
       Open Cur_Prefvalue('FLD_MANDATORY');
       Fetch Cur_Prefvalue into V_PrefValue;
       If Cur_Prefvalue%FOUND then
          COPY(V_PrefValue, 'GLOBAL.FLD_MANVS');
       end if;
       Close Cur_Prefvalue;
  --  end if;
  
  --  If name_in('GLOBAL.F_FLDVS') is null then
       Open Cur_Prefvalue('F_FLD');
       Fetch Cur_Prefvalue into V_PrefValue;
       If Cur_Prefvalue%FOUND then
          COPY(V_PrefValue, 'GLOBAL.F_FLDVS');
       end if;
       Close Cur_Prefvalue;
  --  end if;
  
    -- Get system language_name form company profile
   if name_in('GLOBAL.LANGUAGE_NAME') is null then
      OPEN	CompanyProfile_cur('DEFAULT_LANGUAGE');
      FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
      IF CompanyProfile_cur%FOUND THEN
    COPY( nvl(CompanyProfile_rec.Parameter_Value,'EN'), 'GLOBAL.LANGUAGE_NAME');
      else
        COPY('EN','GLOBAL.LANGUAGE_NAME');
      END IF;
       CLOSE	CompanyProfile_cur;
   end if;
  
    -- Get reports language_name form company profile
    if name_in('GLOBAL.REP_LANG') is null then
       OPEN	CompanyProfile_cur('REPORT_LANGUAGE');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
      COPY( nvl(CompanyProfile_rec.Parameter_Value,'EN'), 'GLOBAL.REP_LANG');
       else
          copy ('EN','GLOBAL.REP_LANG');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
    if name_in('GLOBAL.USER_PRINTER_MODE') is null then
    -- Get user printer mode 
       OPEN	CompanyProfile_cur('ACTIVATE_USER_PRINTER');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.USER_PRINTER_MODE');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.FIELD_AUTH') is null then
       OPEN	CompanyProfile_cur('FIELD_AUTH');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.FIELD_AUTH');
       else
          COPY( 'N', 'GLOBAL.FIELD_AUTH');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
    if name_in('GLOBAL.GET_VERSION') is null then
       OPEN	CompanyProfile_cur('GET_VERSION');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.GET_VERSION');
       else
          COPY('N', 'GLOBAL.GET_VERSION');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.USER_LOG') is null then
       OPEN	CompanyProfile_cur('USER_LOG');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.USER_LOG');
       else
          COPY( 'N', 'GLOBAL.USER_LOG');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.HISTORY_LOG') is null then
       OPEN	CompanyProfile_cur('HISTORY_LOG');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.HISTORY_LOG');
       else
          COPY( 'N', 'GLOBAL.HISTORY_LOG');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.RETCRLIMIT') is null then
       OPEN	CompanyProfile_cur('ENABLE_RET_CRLIMIT');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.RETCRLIMIT');
       else
          COPY( 'N', 'GLOBAL.RETCRLIMIT');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.CHEQUE_TRACE') is null then
       OPEN	CompanyProfile_cur('ENABLE_CHEQUE_TRACE');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.CHEQUE_TRACE');
       else
          COPY( 'N', 'GLOBAL.CHEQUE_TRACE');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.DISPLAY_VERSION') is null then
       OPEN	CompanyProfile_cur('DISPLAY_VERSION');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.DISPLAY_VERSION');
       else
          COPY( 'Y', 'GLOBAL.DISPLAY_VERSION');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.DEFAULT_AREA') is null then
       OPEN	CompanyProfile_cur('DEFAULT_AREA');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.DEFAULT_AREA');
       else
          COPY( '0', 'GLOBAL.DEFAULT_AREA');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
    if name_in('GLOBAL.FIELD_AUTH')  ='Y'  then
       field_auth.init('%',choice_c);
    end if;
  
    if name_in('GLOBAL.SCREEN_LABEL') is null then
       OPEN	CompanyProfile_cur('SCREEN_LABEL');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.SCREEN_LABEL');
       else
          COPY( 'Y', 'GLOBAL.SCREEN_LABEL');
       END IF;
       CLOSE	CompanyProfile_cur;
    end if;
  
  --  if name_in('GLOBAL.SCREEN_LABEL') = 'Y' Then 
       default_value('','Global.hostname');
       w_title := GET_TITLE(choice_cd);
       SET_WINDOW_PROPERTY('WINDOW1',TITLE,w_title);
       if name_in('GLOBAL.USER_LOG') ='Y' then
         -- PUT_USER_LOG(choice_cd,W_TITLE,p_form_ver);
         PUT_USER_LOG(choice_cd,UPPER(NAME_IN('GLOBAL.ROUTINE_NAME')),p_form_ver);
         
       end if;
  --  End If;
  
  
   -- check user authority to access the routine_name
    IF Authority.CheckAuthority(choice_c) != Authority.am_OK THEN
      DO_AUTH;
    END IF;
    if name_in('GLOBAL.GET_VERSION') = 'Y' then
       GET_VERSION(w_title,p_form_ver); 
       DEFAULT_VALUE( '   ', 'GLOBAL.RETAILER');
    end if;
    if name_in('GLOBAL.RETAILER') is null then
    Open cRetail;
    Fetch cRetail into wRetail;
    if cRetail%Notfound then
    TABS_MESS(2229, NAME_IN( 'GLOBAL.LANGUAGE_NAME'));			-- This user is not a retailer user
    end if;
    Close cRetail;
    vc2_Retailer := wRetail.sign;
    COPY( vc2_Retailer, 'GLOBAL.RETAILER');
    end if;
  -- RFS
    DEFAULT_VALUE( '', 'GLOBAL.SYSTEM_USER_ID');
    DEFAULT_VALUE( '', 'GLOBAL.WH_CODE');
    DEFAULT_VALUE( '', 'GLOBAL.PRINTER_1');
    DEFAULT_VALUE( '', 'GLOBAL.PRINTER_2');
    COPY( wUSER, 'GLOBAL.SYSTEM_USER_ID');
    c_Dummy := NAME_IN( 'GLOBAL.SYSTEM_USER_ID');
    if name_in('GLOBAL.WH_CODE') is null then
       Open cRFS;
       Fetch cRFS INTO GLOBAL_WH_CODE, GLOBAL_PRINTER_1, GLOBAL_PRINTER_2;
       if cRFS%notfound then
          message('No Warehouse');
       end if;
       CLOSE CRFS;
       COPY( GLOBAL_WH_CODE, 'GLOBAL.WH_CODE' );
       COPY( GLOBAL_PRINTER_1, 'GLOBAL.PRINTER_1');
       COPY( GLOBAL_PRINTER_2, 'GLOBAL.PRINTER_2');
    end if;
  
       if name_in('GLOBAL.PROMPT_CAPTURE') is null then
           OPEN	CompanyProfile_cur('PROMPT_CAPTURE');
           FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
           IF CompanyProfile_cur%FOUND THEN
              COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.PROMPT_CAPTURE');
           else
              COPY( 'N', 'GLOBAL.PROMPT_CAPTURE');
           END IF;
           CLOSE	CompanyProfile_cur;
      end if;
        If name_in('GLOBAL.PROMPT_CAPTURE')  ='Y'  then 
            --PKG_PROMPT_CAPTURE1.PROMPT_EXEC(name_in('GLOBAL.LANGUAGE_NAME'));
          PKG_PROMPT_CAPTURE.PROMPT_CAPTURE(name_in('GLOBAL.LANGUAGE_NAME')); 
        End If; 		
  
  --  if name_in('GLOBAL.PROMPT_SETTING') is null then
       OPEN	CompanyProfile_cur('PROMPT_SETTING');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.PROMPT_SETTING');
       else
          COPY( 'N', 'GLOBAL.PROMPT_SETTING');
       END IF;
       CLOSE	CompanyProfile_cur;
  --  end if;
  
        If name_in('GLOBAL.PROMPT_SETTING')  ='Y'  then 
            --PKG_PROMPT_CAPTURE1.PROMPT_EXEC(name_in('GLOBAL.LANGUAGE_NAME'));
          PKG_PROMPT_CAPTURE.PROMPT_SETTING(name_in('GLOBAL.LANGUAGE_NAME')); 
        End If; 		
      	
  --  PKG_PROMPT_CAPTURE.PROMPT_EXEC(name_in('GLOBAL.LANGUAGE_NAME'));
  
    
  
  --  if name_in('GLOBAL.FLEXI_FIELDS') is null then
       OPEN	CompanyProfile_cur('FLEXI_FIELDS');
       FETCH	CompanyProfile_cur INTO CompanyProfile_rec;
       IF CompanyProfile_cur%FOUND THEN
          COPY( CompanyProfile_rec.Parameter_Value, 'GLOBAL.FLEXI_FIELDS');
       else
          COPY( 'N', 'GLOBAL.FLEXI_FIELDS');
       END IF;
       CLOSE	CompanyProfile_cur;
   -- end if;
    if name_in('GLOBAL.FLEXI_FIELDS')  ='Y'  then
       SET_FLEXI_FIELD(name_In('GLOBAL.ROUTINE_NAME'));     
    end if;
  
   
  
  1*
    if name_in('GLOBAL.PROMPT_SETTING') = 'Y' then
       if name_in('GLOBAL.USER_LANGUAGE') is null then
          open userlang;
          fetch userlang into wuserlang;
          if userlang%notfound then
             copy(name_in('GLOBAL.LANGUAGE_NAME'),'GLOBAL.USER_LANGUAGE');
          else
             copy(wuserlang.language_name,'GLOBAL.USER_LANGUAGE');
             copy(wuserlang.language_name,'GLOBAL.LANGUAGE_NAME');
          end if;
          close userlang;
       end if;
       Tabs_Prompt.Exec( NAME_IN( 'GLOBAL.LANGUAGE_NAME') );
    end if;
  *2
  END;
    */
  }
  async invoke_form(achoice) {

    this.FORM_TRIGGER_FAILURE = false;

    let b_auth, b_program, w_date, b_type, sub_type, area1, sub_no, choice1;
    let param = "";
    let loc_curr, int_curr, mcount, dummy;
    let wuser = this.starServices.USERNAME;
    let l_Routine_Module, l_company_name;
    let rg_name = 'RG_OPENFORMS';
    let rg_id, gc_id, iGrpCnt;




    this.starServices.sessionParams["CAL_SELDATE"] = ' ';

    let sqlStmt_cprog = " SELECT PROGRAM,RTYPE,MODULE FROM ROUTINES "
      + " WHERE routine_name = '" + achoice + "'";
    let ROUTINESInfo;
    ROUTINESInfo = await this.starServices.execSQL(this, sqlStmt_cprog);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (ROUTINESInfo.length != 0) { //FOUND
        b_program = ROUTINESInfo[0]["PROGRAM"];
        b_type = ROUTINESInfo[0]["RTYPE"];
        l_Routine_Module = ROUTINESInfo[0]["MODULE"];


      }
    }


    this.starServices.sessionParams["ROUTINE_MODULE"] = l_Routine_Module;



    let sqlStmt_c_cur = "SELECT LOC_CURR,INT_CURR FROM IVM_INVOICE_SETUP";
    let IVM_INVOICE_SETUPInfo;
    IVM_INVOICE_SETUPInfo = await this.starServices.execSQL(this, sqlStmt_c_cur);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (IVM_INVOICE_SETUPInfo.length != 0) { //FOUND
        loc_curr = IVM_INVOICE_SETUPInfo[0]["LOC_CURR"];
        int_curr = IVM_INVOICE_SETUPInfo[0]["INT_CURR"];
        this.starServices.sessionParams["LOC_CURR"] = loc_curr;
        this.starServices.sessionParams["INT_CURR"] = int_curr;
      }
    }

    let sqlStmt_c_sys = "SELECT COMPANY_NAME FROM TABSSYS";
    let TABSSYSInfo;
    TABSSYSInfo = await this.starServices.execSQL(this, sqlStmt_c_sys);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (TABSSYSInfo.length != 0) { //FOUND
        this.starServices.sessionParams["COMPANY_NAME"] = TABSSYSInfo[0]["COMPANY_NAME"];
      }
    }
    this.starServices.sessionParams["HOSTNAME"] = "";


    sqlStmt_c_sys = "SELECT COMPANY_NAME FROM TABSSYS";
    TABSSYSInfo;
    TABSSYSInfo = await this.starServices.execSQL(this, sqlStmt_c_sys);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (TABSSYSInfo.length != 0) { //FOUND
        this.starServices.sessionParams["COMPANY_NAME"] = TABSSYSInfo[0]["COMPANY_NAME"];
      }
    }

    let sqlStmt_c1 = "SELECT PARAMETER_VALUE FROM COMPANY_PROFILE WHERE PARAMETER_NAME = 'FILL_ROUTINES_USAGE'";
    let COMPANY_PROFILEInfo;
    COMPANY_PROFILEInfo = await this.starServices.execSQL(this, sqlStmt_c1);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else {
      if (COMPANY_PROFILEInfo.length != 0) { //FOUND
        param = COMPANY_PROFILEInfo[0]["PARAMETER_VALUE"];
      }
    }
    if (param == "")
      param = "N";

    if (param == "Y") {
      let sysdate = this.get_dbdate();
      /*
      //Fuad: this will never update because w_date is not initialized
      let sqlStmt = "update ROUTINES_USAGE_LOG set udate = '" + sysdate + "'" 
                  + "  where username = '" + wuser + "'" 
                  + "  and routine_name = '" + achoice + "'" 
                  + "  and udate = '" + w_date + "'"  ;
      
      
      let ROUTINES_USAGE_LOGInfo   = await this.starServices.execSQL(sqlStmt);
      if (ROUTINES_USAGE_LOGInfo == true){
          this.FORM_TRIGGER_FAILURE = true;
          return (this.FORM_TRIGGER_FAILURE);
      }
      
      */

    }
  }
  public INVOKE_FORM_ORG() {
    /*
    PROCEDURE Invoke_Form(aChoice varchar2) IS
     b_auth         number;
     b_program      VARCHAR2(50);
     w_date         varchar2(50);
     b_type         varchar2(4);
     sub_type       varchar2(1);
     area1          varchar2(4);
     sub_no         varchar2(10);
     choice1        varchar2(20) ;
     param          varchar2(1);
     loc_curr       VARCHAR2(3);
     int_curr       VARCHAR2(3);
     mcount         number := 0;
     dummy          varchar2(10);
     wuser          varchar2(32) := get_user;
  --   wuser          varchar2(32) := user;
     l_Routine_Module  Routines.MODULE%type;
     l_company_name    ivm_Invoice_setup.loc_curr%Type;
  
     cursor c1 is 
          select nvl(parameter_value,'N') from company_profile where parameter_name = 'FILL_ROUTINES_USAGE';
  /
  --retailer type ('I' or 'E')
  cursor c_ret(v_ret varchar2) is
     select int_ext from CRM_retailer_INFO where retailer = ltrim(rtrim(v_ret));
  cursor c_cur is
     SELECT loc_curr,int_curr FROM ivm_Invoice_setup;
  cursor c_sys is
   SELECT company_name FROM tabssys;
  cursor cprog is      
     SELECT PROGRAM,RTYPE,MODULE FROM ROUTINES WHERE routine_name = achoice;
  rg_name varchar2(20) := 'RG_OPENFORMS';
  rg_id   recordgroup;
  gc_id   GroupColumn;
  iGrpCnt number;
  BEGIN
  --copy('GLobal.Cal_SelDate',' ');	--By Ram on 30/7/2003 for fixing problem in calendar	
  COPY(' ','GLobal.Cal_SelDate');
  rg_id := find_group(rg_name);
  if id_null(rg_id) then
    rg_id := create_group(rg_name);
    gc_id := add_group_column(rg_name,'FORM',CHAR_COLUMN,50);
  end if;
  
  --  :global.routine_name := achoice;
  get_auth(achoice,'',b_auth);
  if b_auth = 0 then
    tabs_mess(1339,name_in('global.language_name'));
  elsif b_auth = 9 then
    tabs_mess(826,name_in('global.language_name'));
  else
    open cprog;
    fetch cprog into b_program,b_type,l_Routine_Module;
    close cprog;
    --copy('SYSTEM.MESSAGE_LEVEL', 0);
    COPY(0,'SYSTEM.MESSAGE_LEVEL');
    
  
    copy(NAME_IN('GLobal.Routine_Module'),l_Routine_Module);
  
  
  
   if b_auth = 2 then
  
    --  call(b_program);
      history1.add(achoice);
      if b_type = 'R' then
         exec_report_proc(b_program,'');
      else
         
       open_form(b_program); 
       
        
      
  
      end if;
  else
     
     history1.add(achoice);
     
  --      sub_type := :global.subscr_type;
     --area1 := :global.area;
     --sub_no := :global.subno;
     
    -- Copy('global.subscr_type',sub_type);
   --  Copy('global.area',area1);
    -- Copy('global.subno',sub_no);
     
     
     choice1 := achoice;
  --     open(b_program,ACTIVATE,NO_SESSION,
     call_query(b_program);
     
  
     rollback;
     open c_cur;
     fetch c_cur INTO loc_curr,int_curr;
     close c_cur;
     open	c_sys;
     fetch	c_sys INTO l_company_name;
     Copy(NAME_IN('GLOBAL.COMPANY_NAME'),l_company_name);
     close	c_sys;
  --      open c_adm;
  --      fetch c_adm into :global.language_name,:global.group,:global.retailer;
  --       if c_adm%notfound then
  --         tabs_mess(0,'EN');
  --      end if;
  --      close c_adm;
  --      open c_ret(:global.retailer);
  --      fetch c_ret into :global.retailer_type;
  --      if c_ret%notfound then
  --         tabs_mess(0,'EN');
  --      end if;
  --      close c_ret;
  
     --:global.sel_list := '';
     --:blk_a.t_choice := :global.sel_list ;
  
     default_value('','Global.hostname');
  --      put_dbname;
  end if;
  
  w_date := to_char(to_date(w_date),'DDMMYYYYHH24MISS');
  
  open c1;
  fetch c1 into param;
  if param = 'Y' then
      update routines_usage_log set udate = sysdate
            where username = wuser and routine_name = achoice
            and to_char(udate,'DDMMYYYYHH24MISS') = w_date;
     forms_ddl('commit');
  end if;
  close c1;
  --:SYSTEM.MESSAGE_LEVEL := 25;
  -- Copy('system.message_level',25);
  COPY(25,'system.message_level');
  end if;
  
  END;
  
    */
  }
  public durationInDays(date1, date2) {
    let Time = date2.getTime() - date1.getTime();
    let Days = Time / (1000 * 3600 * 24); //Diference in Days
    return Days;
  }
  public getInvalidControls(object) {
    console.log ("testing getInvalidControls:",   object.form.invalid, object.form.controls)
    const invalid = [];
    const controls = object.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
           let nameMSg = this.starServices.getNLS([], 'ormpgmob_fmb.userInfoOrmpgmobFmbBSubscriber["name"]',name)
            invalid.push(nameMSg);
        }
    }
    this.starServices.showNotification("error", this.starServices.getNLS([invalid.toString()],
    'NO_VALID_DATA_FOR','No valid data for :  ## '));
    return invalid;
}

public getInvalidControls_grid(object) {
  console.log ("testing getInvalidControls:",   object.formGroup.invalid, object.formGroup.controls)
  const invalid = [];
  const controls = object.formGroup.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
         let nameMSg = this.starServices.getNLS([], 'ormpgmob_fmb.userInfoOrmpgmobFmbBSubscriber["name"]',name)
          invalid.push(nameMSg);
      }
  }
  this.starServices.showNotification("error", this.starServices.getNLS([invalid.toString()],
  'NO_VALID_DATA_FOR','No valid data for :  ## '));
  return invalid;
}

async GET_RATE(curr, date1) {
    let alert_but1: number;
    let messge;
    let rate: number;
    date1 = this.starServices.FORMAT_ISO(date1); 

    this.FORM_TRIGGER_FAILURE = false;
    var select_17 = " SELECT  EXCH_RATE  "
      + " FROM MSM_MSCURR  "
      + "where currency = '" + curr + "'  and "
      + "( ( '" + date1 + "'   between startdate and stopdate )  "
      + "or ( startdate <= '" + date1 + "' and stopdate IS NULL ) ) ";

    let MSM_MSCURRInfo = await this.starServices.execSQL(this, select_17);
    console.log("testing :MSM_MSCURRInfo:", select_17, MSM_MSCURRInfo);
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else
      if (MSM_MSCURRInfo.length != 0) {
        rate = MSM_MSCURRInfo[0].EXCH_RATE;
      }
      else {

        this.starServices.showNotification('error', this.starServices.getNLS([curr], 'CONVERSION_RATE_FOR_CURRENCY_IS_MISSING', 'Conversion Rate for Currency ## is missing'));
        rate = -1;

      }
    return rate;

  }

  public get_rate_org() {
    /*
    PROCEDURE get_rate(curr IN VARCHAR2, date1 IN DATE, rate OUT NUMBER) IS
  alert_but1 NUMBER;
  messge varchar2(50);
  BEGIN
    select exch_rate into rate from msm_mscurr
           where currency = curr and
                 ((date1 between startdate and stopdate)
                 or (startdate <= date1 and stopdate IS NULL));
  exception
          when no_data_found then
    --alert_but1 := SHOW_ALERT('missing_rate');         By Ram on 30/7/2003
           set_alert_property('missing_rate',alert_message_text,
                              'Conversion Rate for Currency ' || curr || ' is missing');  
    alert_but1 := SHOW_ALERT('missing_rate'); 
           IF alert_but1 = ALERT_BUTTON1 THEN
        rate := -1;  
     END IF;   
          
          
     
  END;
  */
  }
  async GET_ADM_SYS_DATE(object) {

    this.FORM_TRIGGER_FAILURE = false;
    var cursor_TC_CURSOR = " SELECT  DATIMEF  "
      + " FROM adm_sys ";

    var Sqlstmt_TC_CURSOR;
    Sqlstmt_TC_CURSOR = await this.starServices.execSQL(this, cursor_TC_CURSOR);

    var wd = "";
    if (this.FORM_TRIGGER_FAILURE == true) {
      return;
    }
    else
      if (Sqlstmt_TC_CURSOR.length != 0) {
        wd = Sqlstmt_TC_CURSOR[0].DATIMEF;
      }
      else {
        this.FORM_TRIGGER_FAILURE = true;
        return wd;
      }

    if (Sqlstmt_TC_CURSOR.length == 0) {

      wd = '';

    } else {

      wd = formatDate(this.GET_DATE(), Sqlstmt_TC_CURSOR[0].DATIMEF, object.paramConfig.dateLocale);

    }









  }
  public GET_ADM_SYS_DATE_ORG() {
    /*
    FUNCTION get_adm_sys_date RETURN varchar2 IS
   CURSOR TC_CURSOR IS
      select datimef from adm_sys;
   w1 tc_cursor%rowtype;
    wd varchar2(20);
BEGIN
   OPEN TC_CURSOR;
   FETCH TC_CURSOR INTO w1;
   IF TC_CURSOR%NOTFOUND THEN
      wd := '';
   else
      wd := to_char(get_date,w1.datimef);
   END IF;
   CLOSE TC_CURSOR;
   return wd;
END;
*/
  }
}
