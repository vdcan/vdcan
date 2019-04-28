 
 alter  procedure [dbo].[com_row2cold]
    @sql nvarchar(4000)
as 
begin
/*
创建：袁修志
时间：20:57 2015-11-02
说明：行转列存储过程。
--必须包含colname列和result列(不区分大小写),
--除colname列和result列 其余各列均会作为判别记录唯一性的条件
*/
    create  table #temp([序号] int IDENTITY(1,1)) 
    declare @sqlTemp nvarchar(4000),@sql_select nvarchar(1000),@temp nvarchar(500)
    declare @sql_All nvarchar(4000),@sql_Table nvarchar(1000),@sql_declare nvarchar(1000),@sql_Fetch nvarchar(1000) ,
            @sql_id nvarchar(1000),@sql_id2 nvarchar(1000),@sql_insert nvarchar(1000),@sql_value nvarchar(1000)
 
    set @sql_select = '' set @sql_All = '' set @sql_Table ='' set @sql_declare = '' set @sql_Fetch = ''
    set @sql_id = '' set @sql_id2 = '' set @sql_insert='' set @sql_value = ''
    
    set @sql = lower(LTRIM(@sql))
    set @sqlTemp = @sql
    set @sqlTemp = ' select top 0 * into #tempTbl from ('+@sqlTemp+')z '+
        ' select @temp =  Name+'',''+@temp from ( select top 1111 name from tempdb..syscolumns where id = object_id(N''tempdb..#tempTbl'') order by colorder )z '
    EXECUTE sp_executesql @sqlTemp, N'@temp nvarchar(1000) output',@sql_select output
 
    while charindex(',',@sql_select) > 0 
    begin
        select @temp = lower(LEFT(@sql_select,charindex(',',@sql_select)-1))
        select @sql_select = stuff(@sql_select,1,charindex(',',@sql_select),'')
        
        if (@temp <> 'colname') and (@temp<>'result')
        begin
            set @sql_Table = ' ['+@temp+'] nvarchar(1000),' + @sql_Table     
            set @sql_insert = ' ['+@temp+'],' + @sql_insert     
            set @sql_value ='isnull(@'+@temp+',''''),'+@sql_value 
            set @sql_id =  ' ['+@temp+'] =  isnull(@'+@temp+','''') and' + @sql_id
            set @sql_id2 = ' ['+@temp+'] =  isnull(''''''+@'+@temp+'+'''''' ,'''''''') and' + @sql_id2
        end;
        set @sql_declare = ' @'+@temp+' nvarchar(1000),'+@sql_declare 
        set @sql_Fetch = ' @'+@temp+','+@sql_Fetch 
    end;
    set @sql_Table = 'ALTER TABLE #temp ADD ' +left(@sql_Table,len(@sql_table)-1)+' '
    set @sql_declare = 'declare @sqlTemp nvarchar(4000),' +left(@sql_declare,len(@sql_declare)-1) + ' '
    set @sql_Fetch = left(@sql_Fetch,len(@sql_fetch)-1) + ' '
    set @sql_id = left(@sql_id,len(@sql_id)-3) + ' '
    set @sql_id2 = left(@sql_id2,len(@sql_id2)-3) + ' '
    set @sql_insert = left(@sql_insert,len(@sql_insert)-1) + ' '
    set @sql_value = left(@sql_value,len(@sql_value)-1) + ' '
 
    set @sql_All = @sql_declare + 
            ' Declare myCur Cursor   For '+ @sql + ' Open myCur Fetch NEXT From myCur Into '+ @sql_Fetch+
            ' While @@fetch_status=0 Begin '+
            '   if not exists(select * from tempdb..syscolumns where id = object_id(N''tempdb..#temp'') and name = @colName)
                begin            
                    set @sqlTemp =''alter table #temp add [''+@colName+''] nvarchar(4000) ''
                    exec(@sqlTemp)
                end 
                if not exists(select * from #temp where '+@sql_id+')
                begin
                    insert into #temp('+@sql_insert+') values('+@sql_value+')
                end 
                
                set @sqlTemp ='' update #temp set [''+@colName+''] = isnull(''''''+@result+'''''','''''''') where ' + @sql_id2+''' 
                exec(@sqlTemp)
                
                Fetch NEXT From myCur Into '+ @sql_Fetch+
            'end 
            Close myCur 
            Deallocate myCur 
            select * from #temp
            '
            
    exec (@sql_Table)
    exec(@sql_All)
end




GO
/****** Object:  StoredProcedure [dbo].[sys_add_menu]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

alter  PROC [dbo].[sys_add_menu]
    @menu_code VARCHAR(30) = 'project' ,
    @description NVARCHAR(30) = '项目管理' ,
    @parent VARCHAR(20) = '0' ,
    @url VARCHAR(30) = '/dev/titan',
	@comments VARCHAR(500) =''
AS
    BEGIN
        DECLARE @mid INT ,
            @rid INT ,
            @pid INT
        IF EXISTS ( SELECT  id
                    FROM    vd_Menu
                    WHERE   vd_Menu.menu_code = @menu_code )
            BEGIN 
                PRINT @menu_code + '存在';
                RETURN
            END
        ELSE
            BEGIN
                SELECT  @pid = id
                FROM    vd_menu
                WHERE   menu_code = @parent;
               
                SELECT  @rid =1
                --FROM    vd_role
                --WHERE   role_code = '000';



                INSERT  INTO vd_menu
                        ( menu_code ,
                          menu_name ,
                          parent_id ,
                          menu_type ,
                          button_mode ,
                          url ,
                          icon_class ,
                          icon_url ,
                          sort ,
                          enabled ,
                          remark ,
                          add_by ,
                          add_on ,
                          visible_flag ,
                          menu_token
                        )
                VALUES  ( @menu_code ,
                          @description ,
                          @pid ,
                          2 ,
                          1 ,
                          @url ,
                          'icon-standard-page' ,
                          '' ,
                          '10' ,
                          1 ,
                          @comments ,
                          1 ,
                          GETDATE() ,
                          1 ,
                          ''
                        );
                SET @mid = @@IDENTITY 
		
      
                INSERT  INTO vd_Role_Menu
                        ( role_id, menu_id )
                VALUES  (  1,@mid  );

                INSERT  INTO vd_Role_Menu
                        ( role_id, menu_id )
                VALUES  (  2,@mid  );


            END
	
    END 

GO
/****** Object:  StoredProcedure [dbo].[sys_add_proc]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
 EXEC sys_add_proc @menu_code = 'department',
    @action_name = 'department_pager', @button_name = 'refresh',
    @proc_name = 'usp_department_update', @action_type = 'pager', @sql_type='proc',
	@sql =''
*/
alter  PROC [dbo].[sys_add_proc]
    @menu_code VARCHAR(40) ,
    @button_name VARCHAR(40) ,
    @action_name VARCHAR(40) ,
    @proc_name VARCHAR(30) ,
    @action_type VARCHAR(20) ,
    @sql_type VARCHAR(20) ,
    @sql VARCHAR(MAX),
	@comments VARCHAR(500) =''
AS
    BEGIN
        DECLARE @menu_id INT ,
            @button_id INT;
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Action
                        WHERE   menu_code = @menu_code
                                AND button_name = @button_name
                                AND @proc_name = [procedure_name] )
            BEGIN
                INSERT  INTO dbo.vd_Action
                        ( menu_code ,
                          action_url_name ,
                          action_url ,
                          button_name ,
                          procedure_name ,
                          action_type ,
                          sql_type ,
                          [sql],
						  comments
                  
		                )
                VALUES  ( @menu_code ,
                          @action_name , -- action_url_name - varchar(50)
                          '' , -- action_url - varchar(300)
                          @button_name , -- button_name - varchar(50)
                          @proc_name , -- procedure_name - varchar(150)
                          @action_type  -- action_type - varchar(50)
                          ,
                          @sql_type ,
                          @sql,
						  @comments

		                );
            END;
        SELECT  @menu_id = id
        FROM    dbo.vd_Menu
        WHERE   menu_code = @menu_code;


        SELECT  @button_id = id
        FROM    dbo.vd_Button
        WHERE   button_code = @button_name;

        IF NOT EXISTS ( SELECT  1
                        FROM    vd_menu_button mb
                        WHERE   menu_id = @menu_id
                                AND button_id = @button_id )
            BEGIN
                INSERT  INTO dbo.vd_menu_button
                        ( menu_id ,
                          button_id ,
                          button_sort ,
                          button_text
                        )
                VALUES  ( @menu_id ,
                          @button_id ,
                          0 ,
                          ''
                        );
            END;
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Role_Menu
                        WHERE   menu_id = @menu_id )
            INSERT  INTO dbo.vd_Role_Menu
                    ( role_id, menu_id )
            VALUES  ( 1, @menu_id );
--RoleMenuButton
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Role_Menu_Button
                        WHERE   menu_id = @menu_id
                                AND button_id = @button_id )
            INSERT  INTO dbo.vd_Role_Menu_Button
                    ( role_id, menu_id, button_id )
            VALUES  ( 1, @menu_id, @button_id );


    END;

GO
/****** Object:  StoredProcedure [dbo].[sys_add_proc_old ]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
 EXEC sys_add_proc @menu_code = 'department',
    @action_name = 'department_pager', @button_name = 'refresh',
    @proc_name = 'usp_department_update', @action_type = 'pager'
*/
alter  PROC [dbo].[sys_add_proc_old ]
    @menu_code VARCHAR(50) ,
    @button_name VARCHAR(40) ,
    @action_name VARCHAR(40) ,
    @proc_name VARCHAR(150) ,
    @action_type VARCHAR(20),
	@comments VARCHAR(500) =''
AS
    BEGIN
        DECLARE @menu_id INT ,
            @button_id INT;
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Action
                        WHERE   menu_code = @menu_code
                                AND button_name = @button_name
                                AND @proc_name = [procedure_name] )
            BEGIN
                INSERT  INTO dbo.vd_Action
                        ( menu_code ,
                          action_url_name ,
                          action_url ,
                          button_name ,
                          procedure_name ,
                          action_type   --   ,
						  --sql_type,[sql]
						,comments,
						conn_str
		                )
                VALUES  ( @menu_code ,
                          @action_name , -- action_url_name - varchar(50)
                          '' , -- action_url - varchar(300)
                          @button_name , -- button_name - varchar(50)
                          @proc_name , -- procedure_name - varchar(150)
                          @action_type  -- action_type - varchar(50)
						  --,@sql_type, @sql
						  ,@comments,'app'
		                );
            END;
        SELECT  @menu_id = id
        FROM    dbo.vd_Menu
        WHERE   menu_code = @menu_code;


        SELECT  @button_id = id
        FROM    dbo.vd_Button
        WHERE   button_code = @button_name;

        IF NOT EXISTS ( SELECT  1
                        FROM    vd_menu_button mb
                        WHERE   menu_id = @menu_id
                                AND button_id = @button_id )
            BEGIN
                INSERT  INTO dbo.vd_menu_button
                        ( menu_id ,
                          button_id ,
                          button_sort ,
                          button_text
                        )
                VALUES  ( @menu_id ,
                          @button_id ,
                          0 ,
                          ''
                        );

            END;
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Role_Menu
                        WHERE   menu_id = @menu_id )
            INSERT  INTO dbo.vd_Role_Menu
                    ( role_id, menu_id )
            VALUES  ( 1, @menu_id );
--RoleMenuButton
        IF NOT EXISTS ( SELECT  1
                        FROM    vd_Role_Menu_Button
                        WHERE   menu_id = @menu_id
                                AND button_id = @button_id )
            INSERT  INTO dbo.vd_Role_Menu_Button
                    ( role_id, menu_id, button_id )
            VALUES  ( 1, @menu_id, @button_id );


    END;

GO
/****** Object:  StoredProcedure [dbo].[sys_addtableculumncaption]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  proc  [dbo].[sys_addtableculumncaption]
@table_name varchar(64),
@column_name varchar(64),
@column_caption  varchar(128)
as
begin
	begin try
	/*
	1、检查当前表当前列中有没有列描述的
	2、添加没有列描述的
	3、修改已经有列描述的
	*/
	set nocount on
	declare @ResultID		int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
	if(@column_name is null or @column_name='')
	begin
		raiserror('@column_name参数不能为空',16,1)
	end
	if(@column_caption  is null or @column_caption='')
	begin
		set @column_caption=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('Caption_desc', 'user', 'dbo', 'table', @table_name, 'column', @column_name) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'Caption_desc',@column_caption,N'user',N'dbo',N'table',@table_name,N'column',@column_name
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'Caption_desc',@column_caption,'user',dbo,'table',@table_name,'column',@column_name
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_addtableculumndescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'Caption_desc', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'Caption_desc', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'Caption_desc','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'Caption_desc','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('Caption_desc', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end





GO
/****** Object:  StoredProcedure [dbo].[sys_addtableculumndescription]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 
 
alter  proc [dbo].[sys_addtableculumndescription]
@table_name varchar(64),
@column_name varchar(64),
@column_description  varchar(128)
as
begin
	begin try
	/*
	1、检查当前表当前列中有没有列描述的
	2、添加没有列描述的
	3、修改已经有列描述的
	*/
	set nocount on
	declare @ResultID		int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
	if(@column_name is null or @column_name='')
	begin
		raiserror('@column_name参数不能为空',16,1)
	end
	if(@column_description  is null or @column_description='')
	begin
		set @column_description=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', @table_name, 'column', @column_name) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'MS_description',@column_description,N'user',N'dbo',N'table',@table_name,N'column',@column_name
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'MS_description',@column_description,'user',dbo,'table',@table_name,'column',@column_name
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_addtableculumndescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'MS_description','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'MS_description','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end





GO
/****** Object:  StoredProcedure [dbo].[sys_addtabledescription]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 alter  proc [dbo].[sys_addtabledescription]
@table_name varchar(64),
@table_description varchar(128)
as
begin
	begin try
	/*
	1、检查当前表有没有表描述信息
	2、添加没有表描述
	3、修改已经有表描述
	*/
	set nocount on
	declare @ResultID int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
 
	if(@table_description is null or @table_description='')
	begin
		set @table_description=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', @table_name, NULL, NULL) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'MS_description',@table_description,N'user',N'dbo',N'table',@table_name,NULL,NULL
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'MS_description',@table_description,'user',dbo,'table',@table_name,NULL,NULL
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_savetabledescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'MS_description','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'MS_description','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end




GO
/****** Object:  StoredProcedure [dbo].[sys_alter _table_copy_sql]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[sys_create_table_copy_sql]
    @table VARCHAR(20) = 'test_user',
	@id VARCHAR(200)='1',
	@id_flag INT =1
AS
    BEGIN


        DECLARE @result2 NVARCHAR(MAX);
            
        DECLARE @result NVARCHAR(MAX);
        DECLARE @id_name NVARCHAR(200);
             
      
		SELECT @id_name = column_name FROM dbo.v_table
		WHERE table_name= @table AND flag_identity ='√'
     
        SELECT  @result = STUFF(( SELECT DISTINCT
                                            ',' + column_name
                                  FROM      ( SELECT  '['+  column_name+ ']'  column_name
                                              FROM      dbo.v_table
                                              WHERE    ( table_name = @table ) AND( (@id_flag =1 AND @id_name<> column_name) OR (@id_flag =0))
                                            ) A
                                FOR
                                  XML PATH('')
                                ), 1, 1, '');
        SET @result2 = '  insert into  ' + @table + '(' + @result
            + ')  values( ';

    
        SELECT  @result = STUFF(( SELECT DISTINCT
                                            ',' + '"+replace( replace( CAST( ' + column_name
                                            + ' AS VARCHAR(4000)), CHAR(13),''''), CHAR(10),'''')+"'--   ''''+CAST(areas AS VARCHAR(500))+''''  column_name 
                                  FROM      ( SELECT       '['+  column_name+ ']'   column_name
                                              FROM      dbo.v_table
                                              WHERE     table_name = @table
                                            ) A
                                FOR
                                  XML PATH('')
                                ), 1, 1, '');
								 
        SET @result = REPLACE(@result, '"', '''''''');
		IF @id=''-- AND @id_name IS NOT NULL
		BEGIN
        SET @result = 'select @result2 + ''' + @result + ')'' FROM ' + @table;
        
		END
		ELSE
        BEGIN

        SET @result = 'select @result2 + ''' + @result + ')''  sql FROM ' + @table +' where '+@id_name+' ='''+@id+'''';
		END
        

        EXEC sp_executesql @result, N'@result2 nvarchar(max) ',
            @result2 = @result2;

   --   PRINT @result;

    END;
GO
/****** Object:  StoredProcedure [dbo].[usp_column_list_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_column_list_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@table_name varchar(30) --表名
 AS
    BEGIN 
--        DECLARE @start_index INT 
--        --EasyUI 页序号从1开始，这里减一以修正
--				set @page_index = @page_index -1
--        SET @start_index = @page_size * @page_index
--        DECLARE @table TABLE
--            (
--              new_index INT IDENTITY(1, 1) NOT NULL ,
--id int--编号
--) 
	
--        SELECT  @total_row = COUNT(*)
--        FROM    table_column_admin WITH ( NOLOCK ) 
--        	 where   @table_name=table_name
       
--        INSERT  INTO @table
--                ( id
--		        )
--                SELECT TOP ( @start_index + @page_size )
--                       id 
--                FROM    table_column_admin WITH ( NOLOCK ) 
--                	 where   @table_name=table_name
         
--                ORDER BY 
--                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
--									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
--									CASE WHEN @sort = 'column_name' AND @desc = 'desc' THEN [column_name] END DESC , CASE WHEN @sort = 'column_name' AND @desc = 'asc' THEN [column_name] END ASC ,
--									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN [description] END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN [description] END ASC ,
            
--                        CASE WHEN @sort = ' '  THEN id
--                        END desc  
		
--        DELETE  @table
--        WHERE   new_index <= @start_index
         
--        --SELECT  c.*
--        --FROM    table_column_admin c WITH ( NOLOCK ) 
--        --        JOIN @table o ON c.id = o.id
--        --ORDER BY o.new_index 



			SET @total_row = 10
          SELECT  DISTINCT  
                 v.table_name   table_name
				 ,v.column_caption caption
				 ,v.column_description description,
				 v.column_name column_name
        FROM  dbo.v_table v  WHERE  @table_name = table_name
    
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_column_list_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2  
//			  
//       描述：更新表column_list数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_column_list_update]  @table_name varchar(30)--表名
,@column_name varchar(300)--列名
,@description varchar(200)--描述
 
 ,@caption varchar(200)
 AS
    BEGIN 


	  EXEC [sys_addtableculumncaption] @table_name, @column_name,
            @caption
			IF LEN( RTRIM(@description)) =0
			SET @description = @caption
        EXEC [sys_addtableculumndescription] @table_name, @column_name,
            @description 

--       		--更新表column_list
--          UPDATE  [table_column_admin]
--        SET   
--         [table_name] =  @table_name
--,[column_name] =  @column_name
--,[description] =  @description
--        WHERE   [id] = @id 
        
    
    END 
    



GO
/****** Object:  StoredProcedure [dbo].[usp_department_edit_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷  
//			 test 
//       描述：删除表department_edit数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_department_edit_delete] @id INT--编号
 AS
    BEGIN 
       
       
        DELETE  [test_department]
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_department_edit_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 alter   PROCEDURE [dbo].[usp_department_edit_insert]
    @department_name NVARCHAR(100)--部门名称
    ,
    @description NVARCHAR(300)--描述,
	,
	@add_by int
 AS
    BEGIN 
       
       
        INSERT  INTO [test_department]
                ( [add_on] ,
                  [add_by] ,
                  [department_name] ,
                  [description]
                )
        VALUES  ( GETDATE() ,
                  @add_by ,
                  @department_name ,
                  @description
                )
    END
GO
/****** Object:  StoredProcedure [dbo].[usp_department_edit_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷   
//			 test 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_department_edit_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_department WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    test_department WITH ( NOLOCK )
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'department_name'
                                  AND @desc = 'desc' THEN department_name
                        END DESC ,
                        CASE WHEN @sort = 'department_name'
                                  AND @desc = 'asc' THEN department_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_department c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_department_edit_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷  
//			 test 
//       描述：更新表department_edit数据
//------------------------------------------------------------------------------

*/ 

alter   PROCEDURE [dbo].[usp_department_edit_update]
    @id INT--编号
    ,
    @department_name NVARCHAR(100)--部门名称
    ,
    @description NVARCHAR(300)--描述
AS
    BEGIN 
       		--更新表department_edit
        UPDATE  [test_department]
        SET     [department_name] = @department_name ,
                [description] = @description
        WHERE   [id] = @id;  
    END; 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_department_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 alter   PROCEDURE [dbo].[usp_department_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_department WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    test_department WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'department_name' AND @desc = 'desc' THEN department_name END DESC , CASE WHEN @sort = 'department_name' AND @desc = 'asc' THEN department_name END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN add_on END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN add_on END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN add_by END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN add_by END ASC ,
									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN description END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN description END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_department c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
	SELECT * FROM dbo.flow;
	SELECT * FROM dbo.flow;
	SELECT * FROM dbo.flow;
    END 
    
GO
/****** Object:  StoredProcedure [dbo].[usp_flow_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_insert]  
 @add_by int--创建人
,@flow_name varchar(50)--流程名
,@flow_description varchar(500)--	流程名
,@table_name varchar(150)--表名
,@column_name varchar(150)--状态列名
,@id_column_name varchar(150)--主列名
,@deadline_column_name varchar(150)--过期日列名
,@flow_type varchar(50)--流程类型 1=单页流程图模式 2=多页模式 3=流程图内编辑模式 4=流程图内页面混合模式
,@page_id int--页面编号
,@test_deadline datetime--测试过期日期
,@test_status varchar(20)--测试状态
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow]
          (
           [add_on]
,[add_by]
,[flow_name]
,[flow_description]
,[table_name]
,[column_name]
,[id_column_name]
,[deadline_column_name]
,[flow_type]
,[page_id]
,[test_deadline]
,[test_status]
          )
        values(   
         GETDATE()
,@add_by
,@flow_name
,@flow_description
,@table_name
,@column_name
,@id_column_name
,@deadline_column_name
,@flow_type
,@page_id
,@test_deadline
,@test_status
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_lines_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_lines数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_lines_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_lines]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_lines_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_lines
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_lines_insert] 
 @flow_id int--流程编号
,@name varchar(100)--节点名
,@from varchar(100)--到节点
,@to varchar(100)--从节点
,@gf_id varchar(50)--gf_id
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_lines]
          (
           [flow_id]
,[name]
,[from]
,[to]
,[gf_id]
          )
        values(   
         @flow_id
,@name
,@from
,@to
,@gf_id
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_lines_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_lines_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_lines] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_lines] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'from' AND @desc = 'desc' THEN [from] END DESC , CASE WHEN @sort = 'from' AND @desc = 'asc' THEN [from] END ASC ,
									CASE WHEN @sort = 'to' AND @desc = 'desc' THEN [to] END DESC , CASE WHEN @sort = 'to' AND @desc = 'asc' THEN [to] END ASC ,
									CASE WHEN @sort = 'gf_id' AND @desc = 'desc' THEN [gf_id] END DESC , CASE WHEN @sort = 'gf_id' AND @desc = 'asc' THEN [gf_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_lines] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_lines_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_lines数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_lines_update] 
 @id int--编号
,@flow_id int--流程编号
,@name varchar(100)--节点名
,@from varchar(100)--到节点
,@to varchar(100)--从节点
,@gf_id varchar(50)--gf_id
 
 
 AS
    BEGIN 
       		--更新表flow_lines
          UPDATE  [flow_lines]
        SET   
         [flow_id] =  @flow_id
,[name] =  @name
,[from] =  @from
,[to] =  @to
,[gf_id] =  @gf_id
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_nodes_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_nodes数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_nodes_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_nodes]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_nodes_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_nodes
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_nodes_insert] 
 @name varchar(100)--节点名称
,@type varchar(20)--节点类型
,@flow_id int--流程编号
,@gf_id varchar(50)--节点编号
,@can_cancel int--是否可取消
,@page_type varchar(50)--页面类型
,@status varchar(50)--状态
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_nodes]
          (
           [name]
,[type]
,[flow_id]
,[gf_id]
,[can_cancel]
,[page_type]
,[status]
          )
        values(   
         @name
,@type
,@flow_id
,@gf_id
,@can_cancel
,@page_type
,@status
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_nodes_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_nodes_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_nodes] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_nodes] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'type' AND @desc = 'desc' THEN [type] END DESC , CASE WHEN @sort = 'type' AND @desc = 'asc' THEN [type] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'gf_id' AND @desc = 'desc' THEN [gf_id] END DESC , CASE WHEN @sort = 'gf_id' AND @desc = 'asc' THEN [gf_id] END ASC ,
									CASE WHEN @sort = 'can_cancel' AND @desc = 'desc' THEN [can_cancel] END DESC , CASE WHEN @sort = 'can_cancel' AND @desc = 'asc' THEN [can_cancel] END ASC ,
									CASE WHEN @sort = 'page_type' AND @desc = 'desc' THEN [page_type] END DESC , CASE WHEN @sort = 'page_type' AND @desc = 'asc' THEN [page_type] END ASC ,
									CASE WHEN @sort = 'status' AND @desc = 'desc' THEN [status] END DESC , CASE WHEN @sort = 'status' AND @desc = 'asc' THEN [status] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_nodes] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_nodes_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_nodes数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_nodes_update] 
 @id int--编号
,@name varchar(100)--节点名称
,@type varchar(20)--节点类型
,@flow_id int--流程编号
,@gf_id varchar(50)--节点编号
,@can_cancel int--是否可取消
,@page_type varchar(50)--页面类型
,@status varchar(50)--状态
 
 
 AS
    BEGIN 
       		--更新表flow_nodes
          UPDATE  [flow_nodes]
        SET   
         [name] =  @name
,[type] =  @type
,[flow_id] =  @flow_id
,[gf_id] =  @gf_id
,[can_cancel] =  @can_cancel
,[page_type] =  @page_type
,[status] =  @status
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow] WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow] WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'flow_name' AND @desc = 'desc' THEN [flow_name] END DESC , CASE WHEN @sort = 'flow_name' AND @desc = 'asc' THEN [flow_name] END ASC ,
									CASE WHEN @sort = 'flow_description' AND @desc = 'desc' THEN [flow_description] END DESC , CASE WHEN @sort = 'flow_description' AND @desc = 'asc' THEN [flow_description] END ASC ,
									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
									CASE WHEN @sort = 'column_name' AND @desc = 'desc' THEN [column_name] END DESC , CASE WHEN @sort = 'column_name' AND @desc = 'asc' THEN [column_name] END ASC ,
									CASE WHEN @sort = 'id_column_name' AND @desc = 'desc' THEN [id_column_name] END DESC , CASE WHEN @sort = 'id_column_name' AND @desc = 'asc' THEN [id_column_name] END ASC ,
									CASE WHEN @sort = 'deadline_column_name' AND @desc = 'desc' THEN [deadline_column_name] END DESC , CASE WHEN @sort = 'deadline_column_name' AND @desc = 'asc' THEN [deadline_column_name] END ASC ,
									CASE WHEN @sort = 'flow_type' AND @desc = 'desc' THEN [flow_type] END DESC , CASE WHEN @sort = 'flow_type' AND @desc = 'asc' THEN [flow_type] END ASC ,
									CASE WHEN @sort = 'page_id' AND @desc = 'desc' THEN [page_id] END DESC , CASE WHEN @sort = 'page_id' AND @desc = 'asc' THEN [page_id] END ASC ,
									CASE WHEN @sort = 'test_deadline' AND @desc = 'desc' THEN [test_deadline] END DESC , CASE WHEN @sort = 'test_deadline' AND @desc = 'asc' THEN [test_deadline] END ASC ,
									CASE WHEN @sort = 'test_status' AND @desc = 'desc' THEN [test_status] END DESC , CASE WHEN @sort = 'test_status' AND @desc = 'asc' THEN [test_status] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_recreate_status]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[usp_flow_recreate_status]
@flow_id INT =3,
@add_by INT =1
AS
BEGIN

DELETE flow_status
WHERE flow_id = @flow_id

INSERT INTO dbo.flow_status
				        ( add_on ,
				          flow_id ,
				          status ,
				          status_text
				        )
				 SELECT GETDATE(),
				 @flow_id,
				 status, 
				 name
				 FROM dbo.flow_nodes
				 WHERE flow_id = @flow_id


end
GO
/****** Object:  StoredProcedure [dbo].[usp_flow_status_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_status数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_status_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_status]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_status_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_status
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_status_insert]  @flow_id int--流程编号
,@status varchar(20)--状态
,@status_text varchar(120)--状态名
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_status]
          (
           [add_on]
,[flow_id]
,[status]
,[status_text]
          )
        values(   
         GETDATE()
,@flow_id
,@status
,@status_text
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_status_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_status_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_status] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_status] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'status' AND @desc = 'desc' THEN [status] END DESC , CASE WHEN @sort = 'status' AND @desc = 'asc' THEN [status] END ASC ,
									CASE WHEN @sort = 'status_text' AND @desc = 'desc' THEN [status_text] END DESC , CASE WHEN @sort = 'status_text' AND @desc = 'asc' THEN [status_text] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_status] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_status_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_status数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_status_update] 
 @id int--编号
,@status varchar(20)--状态
,@status_text varchar(120)--状态名
 
 
 AS
    BEGIN 
       		--更新表flow_status
          UPDATE  [flow_status]
        SET   
         [status] =  @status
,[status_text] =  @status_text
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_flow_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_flow_update] 
 @id int--编号
,@add_on datetime--	编号
,@add_by int--创建人
,@flow_name varchar(50)--流程名
,@flow_description varchar(500)--	流程名
,@table_name varchar(150)--表名
,@column_name varchar(150)--状态列名
,@id_column_name varchar(150)--主列名
,@deadline_column_name varchar(150)--过期日列名
,@flow_type varchar(50)--流程类型 1=单页流程图模式 2=多页模式 3=流程图内编辑模式 4=流程图内页面混合模式
,@page_id int--页面编号
,@test_deadline datetime--测试过期日期
,@test_status varchar(20)--测试状态
 
 
 AS
    BEGIN 
       		--更新表flow
          UPDATE  [flow]
        SET   
         [add_on] =  @add_on
,[add_by] =  @add_by
,[flow_name] =  @flow_name
,[flow_description] =  @flow_description
,[table_name] =  @table_name
,[column_name] =  @column_name
,[id_column_name] =  @id_column_name
,[deadline_column_name] =  @deadline_column_name
,[flow_type] =  @flow_type
,[page_id] =  @page_id
,[test_deadline] =  @test_deadline
,[test_status] =  @test_status
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_get_SysColumnSetup_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 09:53:49
//       作者： Jerry 
//       描述：得到数据表SysColumnSetup详细信息
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[usp_get_SysColumnSetup_detail]
    @table_name VARCHAR(50) ,
    @class_name VARCHAR(50)
AS
    BEGIN 
        SELECT *
        FROM    [SysColumnSetup] c
                JOIN dbo.SysTableSetup t ON c.table_id = t.id
        WHERE   t.table_name = @table_name
                AND t.class_name = @class_name
 					
        
    
    END

GO
/****** Object:  StoredProcedure [dbo].[usp_get_SysTableSetup_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 09:12:26
//       作者： 蔡捷 
//       描述：得到数据表SysTableSetup详细信息
//------------------------------------------------------------------------------

*/


alter    PROCEDURE [dbo].[usp_get_SysTableSetup_detail] @table_name VARCHAR(50)
AS
    BEGIN 
        IF EXISTS ( SELECT  1
                    FROM    [SysTableSetup]
                    WHERE   [table_name] = @table_name )
            SELECT  [table_name] ,
                    [class_name] ,
                    [author] ,
                    [comments] ,
                    [add_date] ,
                    [area_name] ,
                    [company]
            FROM    [SysTableSetup]
            WHERE   [table_name] = @table_name 
            order by id desc
        ELSE
            SELECT TOP 1
                    '' [table_name] ,
                    '' [class_name] ,
                    [author] ,
                    '' [comments] ,
                    [add_date] ,
                    [area_name] ,
                    [company]
            FROM    [SysTableSetup]
            ORDER BY id DESC
        
        
    END

GO
/****** Object:  StoredProcedure [dbo].[usp_get_unsent_message]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter  PROC [dbo].[usp_get_unsent_message]
AS
    BEGIN
        DECLARE @id INT;
        SELECT TOP 1
                @id = id
        FROM    wx_message
        WHERE   send_flag = 0;

        SELECT  *
        FROM    dbo.wx_message
        WHERE   id = @id;

        UPDATE  dbo.wx_message
        SET     send_flag = 1
        WHERE   id = @id;

    END;
GO
/****** Object:  StoredProcedure [dbo].[usp_json_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 alter   PROCEDURE [dbo].[usp_json_list] 
  	@id int
AS
    BEGIN 
          select 
           [id]  [id] 
,[name]  [text] 
From  [test_user]
        
    	-- where   @id>id
END 
GO
/****** Object:  StoredProcedure [dbo].[usp_list_js_framwork]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[usp_list_js_framwork]
AS
BEGIN
	SELECT 'easyui' id,
	'easyui' text
	union
	SELECT 'bootstrap' id,
	'bootstrap' text 

end
GO
/****** Object:  StoredProcedure [dbo].[usp_list_language]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[usp_list_language]
AS
BEGIN
	SELECT 'mssql.net' id,
	'mssql.net' text
	union
	SELECT 'InformixJava' id,
	'InformixJava' text
	union
	SELECT 'OracleJava' id,
	'OracleJava' text
	union
	SELECT 'MySQLJava' id,
	'MySQLJava' text
	union
	SELECT 'MySQLPHP' id,
	'MySQLPHP' text
	union
	SELECT 'InformixJava' id,
	'InformixJava' text

end
GO
/****** Object:  StoredProcedure [dbo].[usp_list_proc]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[usp_list_proc]
AS
BEGIN
SELECT id, name from  sysobjects where [type]='P'
ORDER BY name
end
GO
/****** Object:  StoredProcedure [dbo].[usp_list_product]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[usp_list_product]
@Parameter VARCHAR(20)
AS
BEGIN
SELECT id, name from  sysobjects where [type]='P'
ORDER BY name
end
GO
/****** Object:  StoredProcedure [dbo].[usp_loader]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec usp_loader 'ttn','任'

alter  PROC [dbo].[usp_loader]
    @loader VARCHAR(30) = 'ur' ,
    @value VARCHAR(200) = ''
AS
    BEGIN
        DECLARE @table VARCHAR(100) ,
            @column VARCHAR(150) ,
            @sql VARCHAR(MAX);

        SELECT  @table = [table] ,
                @column = [column]
        FROM    loader
        WHERE   loader = @loader;

        SET @sql = 'SELECT distinct ' + @column + ' text from ' + @table + ' where '
            + @column + ' like ''%' + @value + '%'' ';
        PRINT @sql;
		EXEC(@sql)
    END;
GO
/****** Object:  StoredProcedure [dbo].[usp_my_user_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf  
//			  
//       描述：删除表my_user数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_my_user_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [test_user]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_my_user_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			  
//       描述：插入数据到表my_user
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_my_user_insert] 
 @add_by int--创建人
,@user_name nvarchar(100)--用户名
,@password nvarchar(300)--口令
,@email nvarchar(300)--email
,@name nvarchar(30)--姓名
,@department_id int--部门编号
 
 
 AS
    BEGIN 
       
       
          Insert into  [test_user]
          (
           [add_on]
,[add_by]
,[user_name]
,[password]
,[email]
,[name]
,[department_id]
          )
        values(   
         getdate()
,@add_by
,@user_name
,@password
,@email
,@name
,@department_id
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_my_user_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_my_user_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@department_id int--部门编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [test_user] WITH ( NOLOCK ) 
        	 where   @department_id=department_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [test_user] WITH ( NOLOCK ) 
                	 where   @department_id=department_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'user_name' AND @desc = 'desc' THEN [user_name] END DESC , CASE WHEN @sort = 'user_name' AND @desc = 'asc' THEN [user_name] END ASC ,
									CASE WHEN @sort = 'password' AND @desc = 'desc' THEN [password] END DESC , CASE WHEN @sort = 'password' AND @desc = 'asc' THEN [password] END ASC ,
									CASE WHEN @sort = 'email' AND @desc = 'desc' THEN [email] END DESC , CASE WHEN @sort = 'email' AND @desc = 'asc' THEN [email] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'department_id' AND @desc = 'desc' THEN [department_id] END DESC , CASE WHEN @sort = 'department_id' AND @desc = 'asc' THEN [department_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [test_user] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_my_user_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf  
//			  
//       描述：更新表my_user数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_my_user_update] 
 @id int--
,@user_name nvarchar(100)--用户名
,@password nvarchar(300)--口令
,@email nvarchar(300)--email
,@name nvarchar(30)--姓名
,@department_id int--部门编号
 
 
 AS
    BEGIN 
       		--更新表my_user
          UPDATE  [test_user]
        SET   
         [user_name] =  @user_name
,[password] =  @password
,[email] =  @email
,[name] =  @name
,[department_id] =  @department_id
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_myuser_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷  
//			 测试使用 
//       描述：删除表myuser数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_myuser_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [test_user]
        
        WHERE   [id] =0-- @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_myuser_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷   
//			 测试使用 
//       描述：插入数据到表myuser
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_myuser_insert] 
 @add_on datetime--创建日期
,@add_by int--创建人
,@user_name nvarchar(100)--用户名
,@name nvarchar(30)--姓名
,@department_id int--部门编号
,@password nvarchar(300)--
,@email nvarchar(300)--
 
 
 AS
    BEGIN 
       
       
          Insert into  [test_user]
          (
           [add_on]
,[add_by]
,[user_name]
,[name]
,[department_id]
,[password]
,[email]
          )
        values(   
         @add_on
,@add_by
,@user_name
,@name
,@department_id
,@password
,@email
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[usp_myuser_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷   
//			 测试使用 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_myuser_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    ,
    @department_id INT--部门编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK )
        WHERE   @department_id = department_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    test_user WITH ( NOLOCK )
                WHERE   @department_id = department_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'user_name'
                                  AND @desc = 'desc' THEN user_name
                        END DESC ,
                        CASE WHEN @sort = 'user_name'
                                  AND @desc = 'asc' THEN user_name
                        END ASC ,
                        CASE WHEN @sort = 'name'
                                  AND @desc = 'desc' THEN name
                        END DESC ,
                        CASE WHEN @sort = 'name'
                                  AND @desc = 'asc' THEN name
                        END ASC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'desc' THEN department_id
                        END DESC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'asc' THEN department_id
                        END ASC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'desc' THEN password
                        END DESC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'asc' THEN password
                        END ASC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'desc' THEN email
                        END DESC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'asc' THEN email
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_user c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_myuser_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷  
//			 测试使用 
//       描述：更新表myuser数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_myuser_update] 
 @id int--
,@add_on datetime--创建日期
,@add_by int--创建人
,@user_name nvarchar(100)--用户名
,@name nvarchar(30)--姓名
,@department_id int--部门编号
,@password nvarchar(300)--
,@email nvarchar(300)--
 
 
 AS
    BEGIN 
       		--更新表myuser
          UPDATE  [test_user]
        SET   
         [add_on] =  @add_on
,[add_by] =  @add_by
,[user_name] =  @user_name
,[name] =  @name
,[department_id] =  @department_id
,[password] =  @password
,[email] =  @email
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[usp_syn_detail_config]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
exec usp_syn_detail_config 24,
'<row><cn>id</cn><t>int</t><l>10</l></row><row><cn>add_on</cn><t>datetime</t><l>23</l></row><row><cn>add_by</cn><t>int</t><l>10</l></row><row><cn>user_name</cn><t>nvarchar</t><l>50</l></row><row><cn>password</cn><t>nvarchar</t><l>150</l></row><row><cn>email</cn><t>nvarchar</t><l>150</l></row><row><cn>name</cn><t>nvarchar</t><l>15</l></row><row><cn>department_id</cn><t>int</t><l>10</l></row>'
,'test_user2'

select * from 
delete xx_page_detail_config
where page_detail_id=24

*/

alter  PROC [dbo].[usp_syn_detail_config]
    @page_detail_id INT ,
 --   @x VARCHAR(MAX) ,
    @table_name VARCHAR(200)
AS
    BEGIN


	 

		 
        DECLARE @t TABLE
            (
              column_name VARCHAR(50) ,
              column_description NVARCHAR(150) ,
              column_caption NVARCHAR(150) ,
              [type] NVARCHAR(20) ,
              [length] INT,
			  isPrimary INT
            );

	
    --    INSERT  INTO @t
    --        SELECT  column_name cn , -- column_name - varchar(50)
    --            column_description cd , -- column_description - nvarchar(150)
			 --	column_caption c,
    --            type  t, -- column_type - nvarchar(20)
    --            length l -- column_length - int  
				--,CASE WHEN flag_identity = '√'
    --                 OR flag_primary = '√' THEN 1 ELSE 0 END p
    --    FROM    restaurant_app.dbo.v_table --需要根据实际应用数据库改变
    --    WHERE   table_name = @table_name

    --    INSERT  INTO dbo.xx_page_detail_config
    --            ( page_detail_id ,
    --              is_show ,
    --              is_where ,
    --              is_insert ,
    --              is_update ,
    --              width ,
    --              data ,
    --              valid ,
    --              is_required ,
    --              column_name ,
    --              column_description ,
    --              column_type ,
    --              column_length ,
    --              html_type ,
    --              static_value ,
    --              table_name,column_caption, isPrimary
			 --   )
    --            SELECT  @page_detail_id , -- page_detail_id - int
    --                    1 , -- is_show - int
    --                    0 , -- is_where - int
    --                    1 , -- is_insert - int
    --                    1 , -- is_update - int
    --                    0 , -- width - int
    --                    N'' , -- data - nvarchar(250)
    --                    N'' , -- valid - nvarchar(250)
    --                    0 , -- is_required - int
    --                    column_name , -- column_name - varchar(50)
    --                    column_description , -- column_description - nvarchar(150)
    --                    [type] , -- column_type - nvarchar(20)
    --                    [length] , -- column_length - int
    --                    'textbox' , -- html_type - varchar(20)
    --                    N''  -- static_value - nvarchar(50)
    --                    ,
    --                    @table_name,
				--		column_caption,isPrimary
    --            FROM    @t
    --            WHERE   column_name NOT IN (
    --                    SELECT  column_name
    --                    FROM    xx_page_detail_config
    --                    WHERE   table_name = @table_name
    --                            AND @page_detail_id = page_detail_id ); 

    --    DELETE  dbo.xx_page_detail_config
    --    WHERE   page_detail_id = @page_detail_id
    --            AND column_name NOT IN ( SELECT  column_name
    --                                    FROM    @t );

		

      --  DECLARE @xml AS XML;
      --  SET @x = REPLACE(@x, '&gt;', '>');
      --  SET @x = REPLACE(@x, '&lt;', '<');

      --  SET @xml = CAST(@x AS XML);

		 
        --DECLARE @t TABLE
        --    (
        --      column_name VARCHAR(50) ,
        --      column_description NVARCHAR(150) ,
        --      column_caption NVARCHAR(150) ,
        --      [type] NVARCHAR(20) ,
        --      [length] INT
        --    );


      --  INSERT  INTO @t
      --          SELECT  v.value('cn[1]', 'varchar(50)') AS cn ,
      --                  v.value('cd[1]', 'varchar(150)') AS cd ,
      --                  v.value('c[1]', 'varchar(200)') AS c ,
      --                  v.value('t[1]', 'varchar(20)') AS t ,
      --                  v.value('l[1]', 'int') AS l
      --          FROM    @xml.nodes('/row') XML ( v );

      --  INSERT  INTO dbo.xx_page_detail_config
      --          ( page_detail_id ,
      --            is_show ,
      --            is_where ,
      --            is_insert ,
      --            is_update ,
      --            width ,
      --            data ,
      --            valid ,
      --            is_required ,
      --            column_name ,
      --            column_description ,
      --            column_type ,
      --            column_length ,
      --            html_type ,
      --            static_value ,
      --            table_name,column_caption
			   -- )
      --          SELECT  @page_detail_id , -- page_detail_id - int
      --                  1 , -- is_show - int
      --                  0 , -- is_where - int
      --                  1 , -- is_insert - int
      --                  1 , -- is_update - int
      --                  0 , -- width - int
      --                  N'' , -- data - nvarchar(250)
      --                  N'' , -- valid - nvarchar(250)
      --                  0 , -- is_required - int
      --                  column_name , -- column_name - varchar(50)
      --                  column_description , -- column_description - nvarchar(150)
      --                  [type] , -- column_type - nvarchar(20)
      --                  [length] , -- column_length - int
      --                  'textbox' , -- html_type - varchar(20)
      --                  N''  -- static_value - nvarchar(50)
      --                  ,
      --                  @table_name,
						--column_caption
      --          FROM    @t
      --          WHERE   column_name NOT IN (
      --                  SELECT  column_name
      --                  FROM    xx_page_detail_config
      --                  WHERE   table_name = @table_name
      --                          AND @page_detail_id = page_detail_id ); 

      --  DELETE  dbo.xx_page_detail_config
      --  WHERE   page_detail_id = @page_detail_id
      --          AND column_name NOT IN ( SELECT  column_name
      --                                  FROM    @t );



    END; 
GO
/****** Object:  StoredProcedure [dbo].[usp_table_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[usp_table_list]
AS
    BEGIN
        SELECT  name id ,
                name [text]
        FROM    sysobjects
        WHERE   ([type] = 'U' OR [type]='V')                AND name NOT LIKE 'Base_%'
              --  AND name NOT LIKE 'xx_%'
        ORDER BY name
    END
GO
/****** Object:  StoredProcedure [dbo].[usp_table_list_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_table_list_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
--        DECLARE @start_index INT 
--        --EasyUI 页序号从1开始，这里减一以修正
--				set @page_index = @page_index -1
--        SET @start_index = @page_size * @page_index
--        DECLARE @table TABLE
--            (
--              new_index INT IDENTITY(1, 1) NOT NULL ,
--id int--编号
--) 
	
--        SELECT  @total_row = COUNT(*)
--        FROM    table_admin WITH ( NOLOCK ) 
        	       
--        INSERT  INTO @table
--                ( id
--		        )
--                SELECT TOP ( @start_index + @page_size )
--                       id 
--                FROM    table_admin WITH ( NOLOCK ) 
                	         
--                ORDER BY 
--                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
--									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
--									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN [description] END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN [description] END ASC ,
            
--                        CASE WHEN @sort = ' '  THEN id
--                        END desc  
		
--        DELETE  @table
--        WHERE   new_index <= @start_index
         
--        --SELECT  c.*
--        --FROM    table_admin c WITH ( NOLOCK ) 
--        --        JOIN @table o ON c.id = o.id
--        --ORDER BY o.new_index 


		SET @total_row = 10
          SELECT  DISTINCT  
                 v.table_name   table_name
				 ,v.table_description description
        FROM  dbo.v_table v  
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[usp_table_list_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 



/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2  
//			  
//       描述：更新表table_list数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_table_list_update] 
 @table_name varchar(30)--表名
,@description varchar(200)--描述
 
 
 AS
    BEGIN 

	DECLARE @amount INT;
	  SELECT  @amount = COUNT([value])     FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table',  @table_name, NULL, NULL)  
	  IF @amount >0
	  EXECUTE sp_updateextendedproperty  N'MS_description',@description,N'user',N'dbo',N'table',@table_name  ,NULL,NULL ;
	  else
	  EXECUTE  sp_addextendedproperty   N'MS_description',@description,N'user',N'dbo',N'table',@table_name  ,NULL,NULL ;

--            int desc_count = db.Sql(sql_desc_count).QuerySingle<int>();
--            string spnam = desc_count == 0 ? "sp_addextendedproperty" : "sp_updateextendedproperty";

--            string sql = "EXECUTE " + spnam + " N'MS_description',N'" + tabledescription + "',N'user',N'dbo',N'table',N'" + tableName + "',NULL,NULL";
--            db.Sql(sql).Execute();
--       		--更新表table_list
--          UPDATE  [table_admin]
--        SET   
--         [table_name] =  @table_name
--,[description] =  @description
--        WHERE   [id] = @id 
        
    
    END 
    




GO
/****** Object:  StoredProcedure [dbo].[usp_test_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


alter   PROCEDURE [dbo].[usp_test_list]
AS
    BEGIN 
        SELECT DISTINCT TOP 10 
                [add_by] ,
                [add_on] ,
                [department_id] ,
                [department_id] value ,
                [email] ,
             --   [id] ,
                [name] ,
                [password] ,
                [user_name]
        FROM    [test_user];
        
    	       
        
    
    END; 
    





    

GO
/****** Object:  StoredProcedure [dbo].[usp_test_list2]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


alter   PROCEDURE [dbo].[usp_test_list2]
AS
    BEGIN 
        SELECT DISTINCT TOP 10 
                [add_by] ,
                [add_on]  ,
                [department_id] ,
                [department_id]  ,
                [email] xAxis,
             --   [id] ,
                [name] ,
                [password] data,
                [user_name]
        FROM    [test_user]
		WHERE [department_id]=1
		ORDER BY name, xAxis
        
    	       
        
    
    END; 
    





    

GO
/****** Object:  StoredProcedure [dbo].[usp_test_user_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-10
//       作者： 谢军   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_test_user_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10), --排序方向asc or desc,
    @xml varchar(max)
    	,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
 AS
    BEGIN 
    	
    	
    	if(@xml  ='')
    	set @xml  = '<root></root>'
    	
    	  SET @total_row = 10;
        SET @xml = REPLACE(@xml, '&amp;gt', '>');
        SET @xml = REPLACE(@xml, '&amp;lt', '<');
        DECLARE @x XML;
        DECLARE @value VARCHAR(30) ,
            @column_name VARCHAR(30) ,
            @compare VARCHAR(20) ,
             @orand VARCHAR(20) ,
            @sql NVARCHAR(max) ,
            @sql2 NVARCHAR(max) , 
            @sql_where NVARCHAR(max) , 
            @sql_order NVARCHAR(max)
            

        SET @x = CAST(@xml AS XML); 
 
        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  v.value('@value[1]', 'varchar(20)') AS value , 
            v.value('@orand[1]', 'varchar(20)') AS orand ,
                    v.value('@column_name[1]', 'varchar(30)') AS column_name ,
                    v.value('@compare[1]', 'varchar(20)') AS compare
            FROM    @x.nodes('/root/item') XML ( v )
            ORDER BY column_name;

        OPEN  cursor_pair;  

        SET @sql = '';


        
        FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name, @compare;  
        WHILE @@FETCH_STATUS = 0
            BEGIN 
  				
                SET @compare = REPLACE(@compare, 'gt', '>');
                SET @compare = REPLACE(@compare, 'lt', '<'); 
                if(@sql ='')
                        SET @sql = @sql + ' '+  @column_name+' '  + @compare + ' ''' + @value +'''' ; 
                        else 
                        SET @sql = @sql +' '+ @orand+ ' '+ @column_name   + @compare + ' ''' + @value  +''''; 
                FETCH NEXT FROM cursor_pair  INTO @value, @orand,  @column_name, @compare;  
            END;  
            
            if(@sql <>'')
            set @sql ='('+ @sql+')'

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

    --    PRINT @sql;
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;

        IF EXISTS ( ( SELECT    *
                      FROM      tempdb..sysobjects
                      WHERE     id = OBJECT_ID('tempdb..#Tbtest_user')
                    ) )
            DROP TABLE [dbo].[#Tbtest_user];


        create  TABLE [dbo].[#Tbtest_user]
            (
              id2 INT IDENTITY ,
             -- department_name NVARCHAR(30) DEFAULT ( '' ) ,
              id INT DEFAULT ( 100 )
            ); 
    	
    	
    	 set @sql_where=' ( @user_name=user_name or @user_name='''' )
 and  ( @email=email or @email='''' )
 and  ( @name=name or @name='''' )
'
         set @sql_order ='
                ORDER BY 
                									CASE WHEN @sort = ''id''   AND @desc = ''desc'' THEN id END DESC ,   CASE WHEN @sort = ''id'' AND @desc = ''asc'' THEN id END ASC ,
									CASE WHEN @sort = ''add_on''   AND @desc = ''desc'' THEN add_on END DESC ,   CASE WHEN @sort = ''add_on'' AND @desc = ''asc'' THEN add_on END ASC ,
									CASE WHEN @sort = ''add_by''   AND @desc = ''desc'' THEN add_by END DESC ,   CASE WHEN @sort = ''add_by'' AND @desc = ''asc'' THEN add_by END ASC ,
									CASE WHEN @sort = ''user_name''   AND @desc = ''desc'' THEN user_name END DESC ,   CASE WHEN @sort = ''user_name'' AND @desc = ''asc'' THEN user_name END ASC ,
									CASE WHEN @sort = ''password''   AND @desc = ''desc'' THEN password END DESC ,   CASE WHEN @sort = ''password'' AND @desc = ''asc'' THEN password END ASC ,
									CASE WHEN @sort = ''email''   AND @desc = ''desc'' THEN email END DESC ,   CASE WHEN @sort = ''email'' AND @desc = ''asc'' THEN email END ASC ,
									CASE WHEN @sort = ''name''   AND @desc = ''desc'' THEN name END DESC ,   CASE WHEN @sort = ''name'' AND @desc = ''asc'' THEN name END ASC ,
									CASE WHEN @sort = ''department_id''   AND @desc = ''desc'' THEN department_id END DESC ,   CASE WHEN @sort = ''department_id'' AND @desc = ''asc'' THEN department_id END ASC ,
            
                        CASE WHEN @sort = ''''  THEN id
                        END desc  '
		
     
     
       if(@sql <>'' and @sql_where <>'')
                   SET @sql_where= @sql + ' and ' + @sql_where;
    IF(@sql_where <>'')
			SET @sql_where =' where '+@sql_where
			 SET @sql2 = 'SELECT @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK ) '  +@sql_where
        
        
        
         EXEC sp_executesql @sql2, N'
          @total_row int output ,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
',  @total_row OUTPUT,@user_name
,@email
,@name
;   
        PRINT @total_row;
        
        
        
        SET @sql2 = '        INSERT  INTO [#Tbtest_user]
               ( id
		        )
               SELECT TOP ( @start_index + @page_size )   id 
               
      FROM    test_user WITH ( NOLOCK ) '  +@sql_where+@sql_order
      
      
      
         EXEC sp_executesql @sql2, N'
          @start_index int, @page_size int, @desc varchar(20), @sort varchar(20) ,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
', @start_index  , @page_size  , @desc  , @sort  ,@user_name
,@email
,@name
;   
             	
       DELETE  #Tbtest_user
        WHERE   id2 <= @start_index;

        SELECT  t.*  
        FROM    test_user t
                JOIN [#Tbtest_user] o ON t.id = o.id
        ORDER BY o.id2; 
        
    END 
    


 


    

GO
/****** Object:  StoredProcedure [dbo].[usp_test_user_query]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-11
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_test_user_query]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10), --排序方向asc or desc,
    @xml varchar(max)
    	,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
 AS
    BEGIN 
    	
    	
    	if(@xml  ='')
    	set @xml  = '<root></root>'
    	
    	  SET @total_row = 10;
        SET @xml = REPLACE(@xml, '&gt', '>');
        SET @xml = REPLACE(@xml, '&lt', '<');
        DECLARE @x XML;
        DECLARE @value VARCHAR(30) ,
            @column_name VARCHAR(30) ,
            @compare VARCHAR(20) ,
             @orand VARCHAR(20) ,
            @sql NVARCHAR(max) ,
            @sql2 NVARCHAR(max) , 
            @sql_where NVARCHAR(max) , 
            @sql_order NVARCHAR(max)
            

        SET @x = CAST(@xml AS XML); 
 
        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  v.value('@value[1]', 'varchar(20)') AS value , 
            v.value('@orand[1]', 'varchar(20)') AS orand ,
                    v.value('@column_name[1]', 'varchar(30)') AS column_name ,
                    v.value('@compare[1]', 'varchar(20)') AS compare
            FROM    @x.nodes('/root/item') XML ( v )
            ORDER BY column_name;

        OPEN  cursor_pair;  

        SET @sql = '';


        
        FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name, @compare;  
        WHILE @@FETCH_STATUS = 0
            BEGIN 
  				
                SET @compare = REPLACE(@compare, 'gt', '>');
                SET @compare = REPLACE(@compare, 'lt', '<'); 
                if(@sql ='')
                        SET @sql = @sql + ' '+  @column_name+' '  + @compare + ' ''' + @value +'''' ; 
                        else 
                        SET @sql = @sql +' '+ @orand+ ' '+ @column_name   + @compare + ' ''' + @value  +''''; 
                FETCH NEXT FROM cursor_pair  INTO @value, @orand,  @column_name, @compare;  
            END;  
            
            if(@sql <>'')
            set @sql ='('+ @sql+')'

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

    --    PRINT @sql;
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;

        IF EXISTS ( ( SELECT    *
                      FROM      tempdb..sysobjects
                      WHERE     id = OBJECT_ID('tempdb..#Tbtest_user')
                    ) )
            DROP TABLE [dbo].[#Tbtest_user];


        create  TABLE [dbo].[#Tbtest_user]
            (
              id2 INT IDENTITY ,
             -- department_name NVARCHAR(30) DEFAULT ( '' ) ,
              id INT DEFAULT ( 100 )
            ); 
    	
    	
    	 set @sql_where=' ( @email=email or @email='''' )
 and  ( @name=name or @name='''' )
 and  ( @department_id=department_id or @department_id=0 )
'
         set @sql_order ='
                ORDER BY 
                									CASE WHEN @sort = ''id''   AND @desc = ''desc'' THEN id END DESC ,   CASE WHEN @sort = ''id'' AND @desc = ''asc'' THEN id END ASC ,
									CASE WHEN @sort = ''add_on''   AND @desc = ''desc'' THEN add_on END DESC ,   CASE WHEN @sort = ''add_on'' AND @desc = ''asc'' THEN add_on END ASC ,
									CASE WHEN @sort = ''add_by''   AND @desc = ''desc'' THEN add_by END DESC ,   CASE WHEN @sort = ''add_by'' AND @desc = ''asc'' THEN add_by END ASC ,
									CASE WHEN @sort = ''user_name''   AND @desc = ''desc'' THEN user_name END DESC ,   CASE WHEN @sort = ''user_name'' AND @desc = ''asc'' THEN user_name END ASC ,
									CASE WHEN @sort = ''password''   AND @desc = ''desc'' THEN password END DESC ,   CASE WHEN @sort = ''password'' AND @desc = ''asc'' THEN password END ASC ,
									CASE WHEN @sort = ''email''   AND @desc = ''desc'' THEN email END DESC ,   CASE WHEN @sort = ''email'' AND @desc = ''asc'' THEN email END ASC ,
									CASE WHEN @sort = ''name''   AND @desc = ''desc'' THEN name END DESC ,   CASE WHEN @sort = ''name'' AND @desc = ''asc'' THEN name END ASC ,
									CASE WHEN @sort = ''department_id''   AND @desc = ''desc'' THEN department_id END DESC ,   CASE WHEN @sort = ''department_id'' AND @desc = ''asc'' THEN department_id END ASC ,
            
                        CASE WHEN @sort = ''''  THEN id
                        END desc  '
		
     
     
       if(@sql <>'' and @sql_where <>'')
                   SET @sql_where= @sql + ' and ' + @sql_where;
    IF(@sql_where <>'')
			SET @sql_where =' where '+@sql_where
			 SET @sql2 = 'SELECT @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK ) '  +@sql_where
        
        
        
         EXEC sp_executesql @sql2, N'
          @total_row int output ,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
',  @total_row OUTPUT,@email
,@name
,@department_id
;   
        PRINT @total_row;
        
        
        
        SET @sql2 = '        INSERT  INTO [#Tbtest_user]
               ( id
		        )
               SELECT TOP ( @start_index + @page_size )   id 
               
      FROM    test_user WITH ( NOLOCK ) '  +@sql_where+@sql_order
      
      
      
         EXEC sp_executesql @sql2, N'
          @start_index int, @page_size int, @desc varchar(20), @sort varchar(20) ,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
', @start_index  , @page_size  , @desc  , @sort  ,@email
,@name
,@department_id
;   
             	
       DELETE  #Tbtest_user
        WHERE   id2 <= @start_index;

        SELECT  t.*  
        FROM    test_user t
                JOIN [#Tbtest_user] o ON t.id = o.id
        ORDER BY o.id2;         
    END 
        

GO
/****** Object:  StoredProcedure [dbo].[usp_test_user_search]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-11
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_test_user_search]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [test_user] WITH ( NOLOCK ) 
        	 where (  @user_name=user_name or @user_name='' )
 and (  @email=email or @email='' )
 and (  @name=name or @name='' )
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [test_user] WITH ( NOLOCK ) 
                	 where (  @user_name=user_name or @user_name='' )
 and (  @email=email or @email='' )
 and (  @name=name or @name='' )
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'user_name' AND @desc = 'desc' THEN [user_name] END DESC , CASE WHEN @sort = 'user_name' AND @desc = 'asc' THEN [user_name] END ASC ,
									CASE WHEN @sort = 'password' AND @desc = 'desc' THEN [password] END DESC , CASE WHEN @sort = 'password' AND @desc = 'asc' THEN [password] END ASC ,
									CASE WHEN @sort = 'email' AND @desc = 'desc' THEN [email] END DESC , CASE WHEN @sort = 'email' AND @desc = 'asc' THEN [email] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'department_id' AND @desc = 'desc' THEN [department_id] END DESC , CASE WHEN @sort = 'department_id' AND @desc = 'asc' THEN [department_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [test_user] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[usp_update_SysTableSetup]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 11:00:16
//       作者： Jerry 
//       描述：更新表SysTableSetup数据
//------------------------------------------------------------------------------


DECLARE @x XML

SELECT @x = '

<Peoples>

    <People  Name="tudou" sex="女" />

    <People  Name="choushuigou" sex="女"/>

    <People  Name="dongsheng" sex="男" />

</Peoples>'

 

-- 方法1
SELECT

    v.value('@Name[1]','VARCHAR(20)') AS Name,

    v.value('@sex[1]','VARCHAR(20)') AS sex

FROM @x.nodes('/Peoples/People') x(v)


*/


alter    PROCEDURE [dbo].[usp_update_SysTableSetup]
    @table_name VARCHAR(50) ,
    @class_name VARCHAR(50) ,
    @author NVARCHAR(100) ,
    @comments NVARCHAR(1000) ,
    @area_name VARCHAR(50) ,
    @company NVARCHAR(100) ,
    @XML XML
AS
    BEGIN 
        DECLARE @id INT
         
        
        SELECT  @id = id
        FROM    [SysTableSetup]
        WHERE   [table_name] = @table_name
                AND [class_name] = @class_name
                            
                            
        IF EXISTS ( SELECT  *
                    FROM    [SysTableSetup]
                    WHERE   [table_name] = @table_name
                            AND [class_name] = @class_name )
            UPDATE  [SysTableSetup]
            SET     [table_name] = @table_name ,
                    [class_name] = @class_name ,
                    [author] = @author ,
                    [comments] = @comments ,
                    [area_name] = @area_name ,
                    [company] = @company
            WHERE   [table_name] = @table_name
                    AND [class_name] = @class_name  
        ELSE
            BEGIN
                
                INSERT  INTO [SysTableSetup]
                        ( [table_name] ,
                          [class_name] ,
                          [author] ,
                          [comments] ,
                          [add_date] ,
                          [area_name] ,
                          [company]
                        )
                VALUES  ( @table_name ,
                          @class_name ,
                          @author ,
                          @comments ,
                          GETDATE() ,
                          @area_name ,
                          @company
                        )
                SET @id = @@IDENTITY
                
            END
            
        DELETE  dbo.SysColumnSetup
        WHERE   table_id = @id            
     
        DECLARE @is_show INT
        DECLARE @is_insert INT
        DECLARE @is_update INT
        DECLARE @width INT
        DECLARE @data NVARCHAR(250)
        DECLARE @valid NVARCHAR(250)
        DECLARE @is_required INT 
        DECLARE @column_name VARCHAR(50)
        DECLARE @column_description NVARCHAR(150)
        DECLARE @column_type NVARCHAR(20)
        DECLARE @column_length INT
        DECLARE @html_type NVARCHAR(250)
        DECLARE @static_value NVARCHAR(250)

        DECLARE cursor_SysColumnSetup CURSOR LOCAL
        FOR
            SELECT  v.value('@is_show[1]', 'int') AS is_show ,
                    v.value('@is_insert[1]', 'int') AS is_insert ,
                    v.value('@is_update[1]', 'int') AS is_update ,
                    v.value('@width[1]', 'int') AS width ,
                    v.value('@data[1]', 'nvarchar(250)') AS data ,
                    v.value('@valid[1]', 'nvarchar(250)') AS valid ,
                    v.value('@is_required[1]', 'int') AS is_required ,
                    v.value('@column_name[1]', 'nvarchar(50)') AS column_name ,
                    v.value('@column_description[1]', 'nvarchar(150)') AS column_description ,
                    v.value('@column_type[1]', 'nvarchar(20)') AS column_type ,
                    v.value('@column_length[1]', 'int') AS column_length ,
                    v.value('@static_value[1]', 'nvarchar(250)') AS static_value ,
                    v.value('@html_type[1]', 'nvarchar(250)') AS html_type
            FROM    @XML.nodes('/Table/Column') XML ( v )
	
--WHERE  id >10

        OPEN  cursor_SysColumnSetup   
        FETCH NEXT FROM cursor_SysColumnSetup  INTO @is_show, @is_insert,
            @is_update, @width, @data, @valid, @is_required, @column_name,
            @column_description, @column_type, @column_length, @static_value,
            @html_type
        WHILE @@FETCH_STATUS = 0
            BEGIN   
                
                
                INSERT  INTO [SysColumnSetup]
                        ( [is_show] ,
                          [is_insert] ,
                          [is_update] ,
                          [width] ,
                          [data] ,
                          [valid] ,
                          [is_required] ,
                          [table_id] ,
                          [column_name] ,
                          [column_description] ,
                          [column_type] ,
                          [column_length] ,
                          static_value ,
                          html_type
                        )
                VALUES  ( @is_show ,
                          @is_insert ,
                          @is_update ,
                          @width ,
                          @data ,
                          @valid ,
                          @is_required ,
                          @id ,
                          @column_name ,
                          @column_description ,
                          @column_type ,
                          @column_length ,
                          @static_value ,
                          @html_type
                        )
                FETCH NEXT FROM cursor_SysColumnSetup  INTO @is_show, @is_insert,
                    @is_update, @width, @data, @valid, @is_required, @column_name,
                    @column_description, @column_type, @column_length,
                    @static_value, @html_type
            END  

        CLOSE cursor_SysColumnSetup   
        DEALLOCATE cursor_SysColumnSetup
       
        
    
    END

GO
/****** Object:  StoredProcedure [dbo].[usp_vd_action_type_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-01
//       作者： fdsaf   
//			  
//       描述：插入数据到表vd_action_type
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[usp_vd_action_type_insert] 
 @add_by int--add_by
,@code_help varchar(max)--code_help
,@description varchar(500)--description
,@id int--id
,@type varchar(50)--type
,@type_name varchar(200)--type_name
 
 
 AS
    BEGIN 
       
       
          Insert into  [vd_action_type]
          (
           [add_by]
,[add_on]
,[code_help]
,[description]
,[id]
,[type]
,[type_name]
          )
        values(   
         @add_by
,getdate()
,@code_help
,@description
,@id
,@type
,@type_name
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_action_type_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-01
//       作者： fdsaf  
//			  
//       描述：删除表action_type数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_action_type_delete] 
 @id int--id
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_action_type]
        
        WHERE   [id] = @id 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_action_type_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-01
//       作者： fdsaf   
//			  
//       描述：插入数据到表action_type
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_action_type_insert] 
 @add_by int--add_by
,@html varchar(max)--code_help
,@description varchar(500)--description
,@type varchar(50)--type
,@type_name varchar(200)--type_name
 
 
 AS
    BEGIN 
       
	SET @html = REPLACE(@html, '&gt;','>')
	SET @html = REPLACE(@html, '&lt;','<')
       
          Insert into  [vd_action_type]
          (
           [add_by]
,[add_on]
,[code_help]
,[description]
,[type]
,[type_name]
          )
        values(   
         @add_by
,getdate()
,@html
,@description
,@type
,@type_name
      )
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_action_type_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-01
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_action_type_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--id
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [vd_action_type] WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [vd_action_type] WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'code_help' AND @desc = 'desc' THEN [code_help] END DESC , CASE WHEN @sort = 'code_help' AND @desc = 'asc' THEN [code_help] END ASC ,
									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN [description] END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN [description] END ASC ,
									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'type' AND @desc = 'desc' THEN [type] END DESC , CASE WHEN @sort = 'type' AND @desc = 'asc' THEN [type] END ASC ,
									CASE WHEN @sort = 'type_name' AND @desc = 'desc' THEN [type_name] END DESC , CASE WHEN @sort = 'type_name' AND @desc = 'asc' THEN [type_name] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.id ,
                c.add_on ,
                c.add_by ,
                c.type_name ,
                c.description ,
                c.code_help html,
                c.type
        FROM    [vd_action_type] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    

GO
/****** Object:  StoredProcedure [dbo].[vdp_action_type_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-01
//       作者： fdsaf  
//			  
//       描述：更新表action_type数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_action_type_update] 
 @id int--id
,@html varchar(max)--code_help
,@description varchar(500)--description
,@type varchar(50)--type
,@type_name varchar(200)--type_name
 
 
 AS
    BEGIN 
	SET @html = REPLACE(@html, '&gt;','>')
	SET @html = REPLACE(@html, '&lt;','<')
       		--更新表action_type
          UPDATE  [vd_action_type]
        SET   
         [code_help] =  @html
,[description] =  @description
,[type] =  @type
,[type_name] =  @type_name
        WHERE   [id] = @id 
        
    
    END 
    




    

GO
/****** Object:  StoredProcedure [dbo].[vdp_add_action_log]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_add_action_log]
    @add_by INT ,
    @menu_code VARCHAR(200) ,
    @action VARCHAR(300) ,
    @action_data VARCHAR(MAX) ,
    @ip NVARCHAR(50)
AS
    BEGIN
 
        INSERT  INTO [dbo].[vd_action_log]
                ( [add_on] ,
                  [add_by] ,
                  [menu_code] ,
                  [action] ,
                  [action_data] ,
                  [ip]
                )
        VALUES  ( GETDATE() ,
                  @add_by ,
                  @menu_code ,
                  @action ,
                  @action_data ,
                  @ip
                );
 



    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_addtableculumncaption]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  proc  [dbo].[vdp_addtableculumncaption]
@table_name varchar(64),
@column_name varchar(64),
@column_caption  varchar(128)
as
begin
	begin try
	/*
	1、检查当前表当前列中有没有列描述的
	2、添加没有列描述的
	3、修改已经有列描述的
	*/
	set nocount on
	declare @ResultID		int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
	if(@column_name is null or @column_name='')
	begin
		raiserror('@column_name参数不能为空',16,1)
	end
	if(@column_caption  is null or @column_caption='')
	begin
		set @column_caption=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('Caption_desc', 'user', 'dbo', 'table', @table_name, 'column', @column_name) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'Caption_desc',@column_caption,N'user',N'dbo',N'table',@table_name,N'column',@column_name
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'Caption_desc',@column_caption,'user',dbo,'table',@table_name,'column',@column_name
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_addtableculumndescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'Caption_desc', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'Caption_desc', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'Caption_desc','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'Caption_desc','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('Caption_desc', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end






GO
/****** Object:  StoredProcedure [dbo].[vdp_addtableculumndescription]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 
 
alter  proc [dbo].[vdp_addtableculumndescription]
@table_name varchar(64),
@column_name varchar(64),
@column_description  varchar(128)
as
begin
	begin try
	/*
	1、检查当前表当前列中有没有列描述的
	2、添加没有列描述的
	3、修改已经有列描述的
	*/
	set nocount on
	declare @ResultID		int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
	if(@column_name is null or @column_name='')
	begin
		raiserror('@column_name参数不能为空',16,1)
	end
	if(@column_description  is null or @column_description='')
	begin
		set @column_description=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', @table_name, 'column', @column_name) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'MS_description',@column_description,N'user',N'dbo',N'table',@table_name,N'column',@column_name
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'MS_description',@column_description,'user',dbo,'table',@table_name,'column',@column_name
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_addtableculumndescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'MS_description','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'MS_description','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end






GO
/****** Object:  StoredProcedure [dbo].[vdp_addtabledescription]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 alter  proc [dbo].[vdp_addtabledescription]
@table_name varchar(64),
@table_description varchar(128)
as
begin
	begin try
	/*
	1、检查当前表有没有表描述信息
	2、添加没有表描述
	3、修改已经有表描述
	*/
	set nocount on
	declare @ResultID int 			
	declare @ResultMsg	varchar(1024) 	
	set @ResultID=0
	set @ResultMsg=''
	--检查参数
	if(@table_name is null or @table_name='')
	begin
		raiserror('@table_name参数不能为空',16,1)
	end
 
	if(@table_description is null or @table_description='')
	begin
		set @table_description=''
	end

	declare @descCount int
	SELECT  @descCount=count([value]) FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', @table_name, NULL, NULL) 
	if(@descCount=0)--没有列描述
	begin
		--需要添加列描述
		EXECUTE sp_addextendedproperty N'MS_description',@table_description,N'user',N'dbo',N'table',@table_name,NULL,NULL
	end
	if(@descCount>0)--没有列描述
	begin
		--需要修改列描述
		EXECUTE sp_updateextendedproperty 'MS_description',@table_description,'user',dbo,'table',@table_name,NULL,NULL
	end

	end try--结束try
	begin catch
		set @ResultID=@@error
		set @ResultMsg=N'|【sys_savetabledescription】:|行号:'+Convert(nvarchar(20),ERROR_LINE())+'|消息:'+ERROR_MESSAGE()
	end catch

	select @ResultID as ResultID,@ResultMsg as  ResultMsg--返回结果

/*
--1、给表添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段信息表', N'user', N'dbo', N'table', N'bd_Band', NULL, NULL 
--2、为字段Code添加描述信息
EXECUTE sp_addextendedproperty N'MS_description', '波段代码', N'user', N'dbo', N'table', N'bd_Band', N'column', N'Code'
--3、更新表中列Code的描述属性：
EXECUTE sp_updateextendedproperty 'MS_description','波段名称2012','user',dbo,'table','bd_Band','column',Code
--4、删除表中列Code的描述属性：
EXECUTE sp_dropextendedproperty 'MS_description','user',dbo,'table','bd_Band','column',Code

--获取某个表 所有字段的描述
SELECT  * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', 'bd_Band', 'column', default)
--where objname = 'Name'--可以带条件

--获取表 "bd_Band "中列Name的描述属性： 
SELECT  [value] FROM  ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table', 'bd_Band', 'column', 'Name') 
*/
end





GO
/****** Object:  StoredProcedure [dbo].[vdp_area_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf  
//			  
//       描述：删除表area数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_area_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_area]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_area_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			  
//       描述：插入数据到表area
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_area_insert] 
 @area_name varchar(50)--区域名
 
 
 AS
    BEGIN 
       
       
          Insert into  [vd_area]
          (
           [area_name]
          )
        values(   
         @area_name
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_area_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC  [dbo].[vdp_area_list]
AS
BEGIN

SELECT id, area_name text
FROM dbo.vd_area

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_area_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_area_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [vd_area] WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [vd_area] WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'area_name' AND @desc = 'desc' THEN [area_name] END DESC , CASE WHEN @sort = 'area_name' AND @desc = 'asc' THEN [area_name] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [vd_area] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_area_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf  
//			  
//       描述：更新表area数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_area_update] 
 @id int--
,@area_name varchar(50)--区域名
 
 
 AS
    BEGIN 
       		--更新表area
          UPDATE  [vd_area]
        SET   
         [area_name] =  @area_name
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_button_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 按钮管理 
//       描述：删除表button数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_button_delete] @id INT--编号
 AS
    BEGIN 
       
       
        DELETE  [vd_Button]
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_button_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮管理 
//       描述：插入数据到表button
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_button_insert]
    @button_code VARCHAR(64)--按钮代码
    ,
    @button_name VARCHAR(64)--按钮名
    ,
    @button_type INT--按钮类型 0=工具按钮 1=右键按钮 2=其它
    ,
    @icon_class VARCHAR(256)--图标URL
    ,
    @sort INT--排序
    ,
    @js_event VARCHAR(64)--JS事件
    ,
    @enabled INT--启用 0=禁用 1=启用
    ,
    @remark VARCHAR(128)--备注
	,@add_by int
 AS
    BEGIN 
       
       
        INSERT  INTO [vd_Button]
                ( [button_code] ,
                  [button_name] ,
                  [button_type] ,
                  [icon_class] ,
                  [sort] ,
                  [js_event] ,
                  [enabled] ,
                  [remark] ,
                  [add_by] ,
                  [add_on]
                )
        VALUES  ( @button_code ,
                  @button_name ,
                  @button_type ,
                  @icon_class ,
                  @sort ,
                  @js_event ,
                  @enabled ,
                  @remark ,
                  @add_by ,
                  GETDATE()
                )
        
    
    END 

GO
/****** Object:  StoredProcedure [dbo].[vdp_button_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮管理 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_button_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Button WITH ( NOLOCK ) 
		IF @sort=''
		SET @sort ='sort'
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_Button WITH ( NOLOCK )
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'button_code'
                                  AND @desc = 'desc' THEN button_code
                        END DESC ,
                        CASE WHEN @sort = 'button_code'
                                  AND @desc = 'asc' THEN button_code
                        END ASC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'desc' THEN button_name
                        END DESC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'asc' THEN button_name
                        END ASC ,
                        CASE WHEN @sort = 'button_type'
                                  AND @desc = 'desc' THEN button_type
                        END DESC ,
                        CASE WHEN @sort = 'button_type'
                                  AND @desc = 'asc' THEN button_type
                        END ASC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'desc' THEN icon_class
                        END DESC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'asc' THEN icon_class
                        END ASC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'desc' THEN icon_url
                        END DESC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'asc' THEN icon_url
                        END ASC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'desc' THEN sort
                        END DESC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'asc' THEN sort
                        END ASC ,
                        CASE WHEN @sort = 'js_event'
                                  AND @desc = 'desc' THEN js_event
                        END DESC ,
                        CASE WHEN @sort = 'js_event'
                                  AND @desc = 'asc' THEN js_event
                        END ASC ,
                        CASE WHEN @sort = 'split'
                                  AND @desc = 'desc' THEN split
                        END DESC ,
                        CASE WHEN @sort = 'split'
                                  AND @desc = 'asc' THEN split
                        END ASC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'desc' THEN enabled
                        END DESC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'asc' THEN enabled
                        END ASC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'desc' THEN remark
                        END DESC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'asc' THEN remark
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Button c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_button_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 按钮管理 
//       描述：更新表button数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_button_update]
    @id INT--编号
    ,
    @button_code VARCHAR(64)--按钮代码
    ,
    @button_name VARCHAR(64)--按钮名
    ,
    @button_type INT--按钮类型 0=工具按钮 1=右键按钮 2=其它
    ,
    @icon_class VARCHAR(256)--图标URL
    ,
    @sort INT--排序
    ,
    @js_event VARCHAR(64)--JS事件
    ,
    @enabled INT--启用 0=禁用 1=启用
    ,
    @remark VARCHAR(128)--备注
 AS
    BEGIN 
       		--更新表button
        UPDATE  [vd_Button]
        SET     [button_code] = @button_code ,
                [button_name] = @button_name ,
                [button_type] = @button_type ,
                [icon_class] = @icon_class ,
                [sort] = @sort ,
                [js_event] = @js_event ,
                [enabled] = @enabled ,
                [remark] = @remark
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_clean_db]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_clean_db]
AS
    BEGIN


        DELETE  [dbo].[vd_menu_button]
        WHERE   menu_id NOT IN ( SELECT    id
                                  FROM      [dbo].[vd_Menu] )

        DELETE  [dbo].[vd_action]
        WHERE   Menu_Code NOT IN ( SELECT   menu_code
                                   FROM     [dbo].[vd_Menu] )


        DELETE  [dbo].vd_Role_Menu
        WHERE   menu_id NOT IN ( SELECT    id
                                  FROM      [dbo].[vd_Menu] )



        DELETE  [dbo].vd_Role_Menu_Button
        WHERE   menu_id NOT IN ( SELECT    id
                                  FROM      [dbo].[vd_Menu] )

        DELETE  [dbo].vd_User_Role
        WHERE   userid NOT IN ( SELECT  userid
                                FROM    [dbo].vd_User )

        DELETE  [dbo].vd_User_Setting
        WHERE   userid NOT IN ( SELECT  userid
                                FROM    [dbo].vd_User )


    END  

GO
/****** Object:  StoredProcedure [dbo].[vdp_column_list_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_column_list_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@table_name varchar(30) --表名
 AS
    BEGIN 
--        DECLARE @start_index INT 
--        --EasyUI 页序号从1开始，这里减一以修正
--				set @page_index = @page_index -1
--        SET @start_index = @page_size * @page_index
--        DECLARE @table TABLE
--            (
--              new_index INT IDENTITY(1, 1) NOT NULL ,
--id int--编号
--) 
	
--        SELECT  @total_row = COUNT(*)
--        FROM    table_column_admin WITH ( NOLOCK ) 
--        	 where   @table_name=table_name
       
--        INSERT  INTO @table
--                ( id
--		        )
--                SELECT TOP ( @start_index + @page_size )
--                       id 
--                FROM    table_column_admin WITH ( NOLOCK ) 
--                	 where   @table_name=table_name
         
--                ORDER BY 
--                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
--									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
--									CASE WHEN @sort = 'column_name' AND @desc = 'desc' THEN [column_name] END DESC , CASE WHEN @sort = 'column_name' AND @desc = 'asc' THEN [column_name] END ASC ,
--									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN [description] END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN [description] END ASC ,
            
--                        CASE WHEN @sort = ' '  THEN id
--                        END desc  
		
--        DELETE  @table
--        WHERE   new_index <= @start_index
         
--        --SELECT  c.*
--        --FROM    table_column_admin c WITH ( NOLOCK ) 
--        --        JOIN @table o ON c.id = o.id
--        --ORDER BY o.new_index 



			SET @total_row = 10
          SELECT  DISTINCT  
                 v.table_name   table_name
				 ,v.column_caption caption
				 ,v.column_description description,
				 v.column_name column_name
        FROM  dbo.v_table v  WHERE  @table_name = table_name
    
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_column_list_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2  
//			  
//       描述：更新表column_list数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_column_list_update]  @table_name varchar(30)--表名
,@column_name varchar(300)--列名
,@description varchar(200)--描述
 
 ,@caption varchar(200)
 AS
    BEGIN 


	  EXEC [vdp_addtableculumncaption] @table_name, @column_name,
            @caption
			IF LEN( RTRIM(@description)) =0
			SET @description = @caption
        EXEC [vdp_addtableculumndescription] @table_name, @column_name,
            @description 

--       		--更新表column_list
--          UPDATE  [table_column_admin]
--        SET   
--         [table_name] =  @table_name
--,[column_name] =  @column_name
--,[description] =  @description
--        WHERE   [id] = @id 
        
    
    END 
    




GO
/****** Object:  StoredProcedure [dbo].[vdp_controller_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf  
//			  
//       描述：删除表controller数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_controller_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_controller]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_controller_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			  
//       描述：插入数据到表controller
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_controller_insert] 
 @area_id int--area_id
,@controller_name varchar(50)--控制器名
 
 
 AS
    BEGIN 
       
       
          Insert into  [vd_controller]
          (
           [area_id]
,[controller_name]
          )
        values(   
         @area_id
,@controller_name
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_controller_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC  [dbo].[vdp_controller_list]
AS
BEGIN

SELECT id, controller_name text, area_id
FROM dbo.vd_controller

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_controller_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_controller_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@area_id int--area_id
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [vd_controller] WITH ( NOLOCK ) 
        	 where   @area_id=area_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [vd_controller] WITH ( NOLOCK ) 
                	 where   @area_id=area_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'area_id' AND @desc = 'desc' THEN [area_id] END DESC , CASE WHEN @sort = 'area_id' AND @desc = 'asc' THEN [area_id] END ASC ,
									CASE WHEN @sort = 'controller_name' AND @desc = 'desc' THEN [controller_name] END DESC , CASE WHEN @sort = 'controller_name' AND @desc = 'asc' THEN [controller_name] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [vd_controller] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_controller_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf  
//			  
//       描述：更新表controller数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_controller_update] 
 @id int--
,@controller_name varchar(50)--控制器名
 
 
 AS
    BEGIN 
       		--更新表controller
          UPDATE  [vd_controller]
        SET   
         [controller_name] =  @controller_name
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_copy_page]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
exec usp_copy_page 'vd_page_detail_config','vd_page',''

*/

alter  PROC [dbo].[vdp_copy_page]
    @from VARCHAR(200) ,
    @to VARCHAR(200),
	@parent VARCHAR(200)
AS
    BEGIN
        DECLARE @button_name VARCHAR(40) ,
            @action_name VARCHAR(50) ,
            @proc_name VARCHAR(230) ,
            @action_type VARCHAR(20);

        DECLARE @menu_code VARCHAR(30) ,
            @description NVARCHAR(30) ,
        --    @parent VARCHAR(20) ,
            @url VARCHAR(30) ,
            @comments VARCHAR(500);  

			IF @parent =''
        SELECT  @parent = mp.menu_code
        FROM    dbo.vd_Menu m
                JOIN dbo.vd_Menu mp ON m.parent_id = mp.id
        WHERE   m.menu_code = @from;

        IF @to = ''
            SET @menu_code = @from;
        ELSE
            SET @menu_code = @to;


        
        SELECT  @url = url ,
                @description = menu_name ,
                @comments = remark
        FROM    dbo.vd_Menu
        WHERE   menu_code = @from;
 
        PRINT 'exec sys_add_menu    @menu_code =''' + @menu_code
            + ''',    @description = ''' + @description + ''',    @parent ='''
            + @parent + ''',    @url =''' + @url + ''',	@comments ='''
            + @comments + '''';




 --sys_add_proc_old
 --   @menu_code VARCHAR(40) ,
 --   @button_name VARCHAR(40) ,
 --   @action_name VARCHAR(40) ,
 --   @proc_name VARCHAR(30) ,
 --   @action_type VARCHAR(20),
	--@comments VARCHAR(500) =''


     --   DECLARE @mid VARCHAR(20);
     --   DECLARE @aid VARCHAR(20);
     --   SELECT  @mid = id
     --   FROM    dbo.vd_Menu
     --   WHERE   menu_code = @from;
 
 
     --   EXEC sys_alter _table_copy_sql 'vd_Menu', @mid, 1;

        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  button_name ,
                    action_type ,
                    comments ,
                    procedure_name ,
                    action_url_name
            FROM    dbo.vd_Action
            WHERE   menu_code = @from;
        OPEN  cursor_pair;   
        FETCH NEXT FROM cursor_pair  INTO @button_name, @action_type,
            @comments, @proc_name, @action_name;
        WHILE @@FETCH_STATUS = 0
            BEGIN 
                PRINT 'exec sys_add_proc_old    @Menu_Code =''' + @menu_code
                    + ''',    @button_name = ''' + @button_name
                    + ''',    @action_type =''' + @action_type
                    + ''',    @proc_name =''' + @proc_name
                    + ''',  @action_name =''' + @action_name
                    + ''', 	@comments =''' + @comments + '''';


                FETCH NEXT FROM cursor_pair  INTO @button_name, @action_type,
                    @comments, @proc_name, @action_name;
            END;  

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

	--IF @to =''
 --       PRINT 'SET IDENTITY_INSERT   vd_template ON ';

	--	   SET @x = CAST(@xml AS XML); 
 
 --       DECLARE cursor_pair CURSOR LOCAL
 --       FOR
 --           SELECT  
 --           FROM    @x.nodes('/root/item') XML ( v )
 --           ORDER BY column_name;

 --       OPEN  cursor_pair;   


        
 --       FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name, @compare;  
 --       WHILE @@FETCH_STATUS = 0
 --           BEGIN 
  				
 --               SET @compare = REPLACE(@compare, 'gt', '>');
 --               SET @compare = REPLACE(@compare, 'lt', '<'); 
 --               if(@sql ='')
 --                       SET @sql = @sql + ' '+  @column_name+' '  + @compare + ' ''' + @value +'''' ; 
 --                       else 
 --                       SET @sql = @sql +' '+ @orand+ ' '+ @column_name   + @compare + ' ''' + @value  +''''; 
 --               FETCH NEXT FROM cursor_pair  INTO @value, @orand,  @column_name, @compare;  
 --           END;  
            
 --           if(@sql <>'')
 --           set @sql ='('+ @sql+')'

 --       CLOSE cursor_pair;   
 --       DEALLOCATE cursor_pair;

    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_create_table_copy_sql _table_copy_sql]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_create_table_copy_sql]
    @table VARCHAR(20) = 'test_user',
	@id VARCHAR(200)='1',
	@id_flag INT =1
AS
    BEGIN


        DECLARE @result2 NVARCHAR(MAX);
            
        DECLARE @result NVARCHAR(MAX);
        DECLARE @id_name NVARCHAR(200);
             
      
		SELECT @id_name = column_name FROM dbo.v_table
		WHERE table_name= @table AND flag_identity ='√'
     
        SELECT  @result = STUFF(( SELECT DISTINCT
                                            ',' + column_name
                                  FROM      ( SELECT  '['+  column_name+ ']'  column_name
                                              FROM      dbo.v_table
                                              WHERE    ( table_name = @table ) AND( (@id_flag =1 AND @id_name<> column_name) OR (@id_flag =0))
                                            ) A
                                FOR
                                  XML PATH('')
                                ), 1, 1, '');
        SET @result2 = '  insert into  ' + @table + '(' + @result
            + ')  values( ';

    
        SELECT  @result = STUFF(( SELECT DISTINCT
                                            ',' + '"+replace( replace( CAST( ' + column_name
                                            + ' AS VARCHAR(4000)), CHAR(13),''''), CHAR(10),'''')+"'--   ''''+CAST(areas AS VARCHAR(500))+''''  column_name 
                                  FROM      ( SELECT       '['+  column_name+ ']'   column_name
                                              FROM      dbo.v_table
                                              WHERE     table_name = @table
                                            ) A
                                FOR
                                  XML PATH('')
                                ), 1, 1, '');
								 
        SET @result = REPLACE(@result, '"', '''''''');
		IF @id=''-- AND @id_name IS NOT NULL
		BEGIN
        SET @result = 'select @result2 + ''' + @result + ')'' FROM ' + @table;
        
		END
		ELSE
        BEGIN

        SET @result = 'select @result2 + ''' + @result + ')''  sql FROM ' + @table +' where '+@id_name+' ='''+@id+'''';
		END
        

        EXEC sp_executesql @result, N'@result2 nvarchar(max) ',
            @result2 = @result2;

   --   PRINT @result;

    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:38
//       作者： 蔡捷     
//			  
//       描述：删除表vd_Action数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_delete_Action] @id INT
AS
    BEGIN 
       
       
        DELETE  [vd_Action]
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_Base_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:38
//       作者： 蔡捷     
//			  
//       描述：删除表Base_Action数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_delete_Base_Action] @id INT
AS
    BEGIN 
       
       
        DELETE  [vd_Action]
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_Base_Procedure_Parameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:27
//       作者： 蔡捷     
//			  
//       描述：删除表Base_Procedure_Parameters数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_delete_Base_Procedure_Parameters] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  vd_Proc_Parameters
        
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_ProcParameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:27
//       作者： 蔡捷     
//			  
//       描述：删除表Base_Procedure_Parameters数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_delete_ProcParameters] @id INT
AS
    BEGIN 
       
       
        DELETE  [vd_Proc_Parameters]
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_vd_module]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：删除表vd_module数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_delete_vd_module] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_module]
        
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_vd_page]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：删除表vd_page数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_delete_vd_page] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_page]
        
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_vd_page_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：删除表vd_page_detail数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_delete_vd_page_detail] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_page_detail]
        
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_vd_source]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 alter   PROCEDURE [dbo].[vdp_delete_vd_source] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_source]
        
        WHERE   [id] = @id 
        
    
    END 
    





GO
/****** Object:  StoredProcedure [dbo].[vdp_delete_vd_template]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：删除表vd_template数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_delete_vd_template] 
 @id int
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_template]
        
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_Department_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROCEDURE [dbo].[vdp_Department_delete] @id INT--编号
AS
    BEGIN 
       
       
        DELETE  [vd_Department]
        WHERE   [id] = @id; 
        
    
    END; 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_department_edit_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷  
//			 test 
//       描述：删除表department_edit数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_department_edit_delete] @id INT--编号
 AS
    BEGIN 
       
       
        DELETE  [test_department]
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_department_edit_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 alter   PROCEDURE [dbo].[vdp_department_edit_insert]
    @department_name NVARCHAR(100)--部门名称
    ,
    @description NVARCHAR(300)--描述,
	,
	@add_by int
 AS
    BEGIN 
       
       
        INSERT  INTO [test_department]
                ( [add_on] ,
                  [add_by] ,
                  [department_name] ,
                  [description]
                )
        VALUES  ( GETDATE() ,
                  @add_by ,
                  @department_name ,
                  @description
                )
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_department_edit_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷   
//			 test 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_department_edit_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_department WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    test_department WITH ( NOLOCK )
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'department_name'
                                  AND @desc = 'desc' THEN department_name
                        END DESC ,
                        CASE WHEN @sort = 'department_name'
                                  AND @desc = 'asc' THEN department_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_department c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_department_edit_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷  
//			 test 
//       描述：更新表department_edit数据
//------------------------------------------------------------------------------

*/ 

alter   PROCEDURE [dbo].[vdp_department_edit_update]
    @id INT--编号
    ,
    @department_name NVARCHAR(100)--部门名称
    ,
    @description NVARCHAR(300)--描述
AS
    BEGIN 
       		--更新表department_edit
        UPDATE  [test_department]
        SET     [department_name] = @department_name ,
                [description] = @description
        WHERE   [id] = @id;  
    END; 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_Department_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter   PROCEDURE [dbo].[vdp_Department_insert]
    @department_name VARCHAR(128)--部门名称
    ,
    @parent_id INT--父部门编号
    ,
    @short_name VARCHAR(64)--简名
    ,
    @company_code VARCHAR(10)--公司代码
    ,
    @sort INT--排序
    ,
    @enabled INT--是否启用
    ,
    @remark VARCHAR(128)--备注
    ,
    @phone VARCHAR(64)--电话
    ,
    @email VARCHAR(64)--电子邮件
    ,
    @address VARCHAR(128)--地址
    ,
    @fax VARCHAR(64)--传真
    ,
    @add_by INT--创建人
AS
    BEGIN 
       
       
        INSERT  INTO [vd_Department]
                ( [parent_id] ,
                  [department_name] ,
                  [short_name] ,
                  [company_code] ,
                  [sort] ,
                  [enabled] ,
                  [remark] ,
                  [phone] ,
                  [email] ,
                  [address] ,
                  [fax] ,
                  [add_by] ,
                  [add_on]
                )
        VALUES  ( @parent_id ,
                  @department_name ,
                  @short_name ,
                  @company_code ,
                  @sort ,
                  @enabled ,
                  @remark ,
                  @phone ,
                  @email ,
                  @address ,
                  @fax ,
                  @add_by ,
                  GETDATE()
                );
        
    
    END; 
    



GO
/****** Object:  StoredProcedure [dbo].[vdp_department_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 alter   PROCEDURE [dbo].[vdp_department_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_department WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    test_department WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'department_name' AND @desc = 'desc' THEN department_name END DESC , CASE WHEN @sort = 'department_name' AND @desc = 'asc' THEN department_name END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN add_on END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN add_on END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN add_by END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN add_by END ASC ,
									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN description END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN description END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_department c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
	SELECT * FROM dbo.flow;
	SELECT * FROM dbo.flow;
	SELECT * FROM dbo.flow;
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_Department_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷  
//			 部门 
//       描述：更新表vd_Department数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_Department_update]
    @id INT--编号
    ,
    @department_name VARCHAR(128)--部门名称
    ,
    @short_name VARCHAR(64)--简名
    ,
    @company_code VARCHAR(10)--公司代码
    ,
    @sort INT--排序
    ,
    @enabled INT--是否启用
    ,
    @remark VARCHAR(128)--备注
    ,
    @phone VARCHAR(64)--电话
    ,
    @email VARCHAR(64)--电子邮件
    ,
    @address VARCHAR(128)--地址
    ,
    @fax VARCHAR(64)--传真
AS
    BEGIN 
       		--更新表vd_Department
        UPDATE  [vd_Department]
        SET     [department_name] = @department_name ,
                [short_name] = @short_name ,
                [company_code] = @company_code ,
                [sort] = @sort ,
                [enabled] = @enabled ,
                [remark] = @remark ,
                [phone] = @phone ,
                [email] = @email ,
                [address] = @address ,
                [fax] = @fax
        WHERE   [id] = @id; 
        
    
    END; 
    





GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_insert]  
 @add_by int--创建人
,@flow_name varchar(50)--流程名
,@flow_description varchar(500)--	流程名
,@table_name varchar(150)--表名
,@column_name varchar(150)--状态列名
,@id_column_name varchar(150)--主列名
,@deadline_column_name varchar(150)--过期日列名
,@flow_type varchar(50)--流程类型 1=单页流程图模式 2=多页模式 3=流程图内编辑模式 4=流程图内页面混合模式
,@page_id int--页面编号
,@test_deadline datetime--测试过期日期
,@test_status varchar(20)--测试状态
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow]
          (
           [add_on]
,[add_by]
,[flow_name]
,[flow_description]
,[table_name]
,[column_name]
,[id_column_name]
,[deadline_column_name]
,[flow_type]
,[page_id]
,[test_deadline]
,[test_status]
          )
        values(   
         GETDATE()
,@add_by
,@flow_name
,@flow_description
,@table_name
,@column_name
,@id_column_name
,@deadline_column_name
,@flow_type
,@page_id
,@test_deadline
,@test_status
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_lines_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_lines数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_lines_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_lines]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_lines_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_lines
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_lines_insert] 
 @flow_id int--流程编号
,@name varchar(100)--节点名
,@from varchar(100)--到节点
,@to varchar(100)--从节点
,@gf_id varchar(50)--gf_id
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_lines]
          (
           [flow_id]
,[name]
,[from]
,[to]
,[gf_id]
          )
        values(   
         @flow_id
,@name
,@from
,@to
,@gf_id
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_lines_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_lines_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_lines] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_lines] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'from' AND @desc = 'desc' THEN [from] END DESC , CASE WHEN @sort = 'from' AND @desc = 'asc' THEN [from] END ASC ,
									CASE WHEN @sort = 'to' AND @desc = 'desc' THEN [to] END DESC , CASE WHEN @sort = 'to' AND @desc = 'asc' THEN [to] END ASC ,
									CASE WHEN @sort = 'gf_id' AND @desc = 'desc' THEN [gf_id] END DESC , CASE WHEN @sort = 'gf_id' AND @desc = 'asc' THEN [gf_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_lines] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_lines_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_lines数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_lines_update] 
 @id int--编号
,@flow_id int--流程编号
,@name varchar(100)--节点名
,@from varchar(100)--到节点
,@to varchar(100)--从节点
,@gf_id varchar(50)--gf_id
 
 
 AS
    BEGIN 
       		--更新表flow_lines
          UPDATE  [flow_lines]
        SET   
         [flow_id] =  @flow_id
,[name] =  @name
,[from] =  @from
,[to] =  @to
,[gf_id] =  @gf_id
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_nodes_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_nodes数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_nodes_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_nodes]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_nodes_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_nodes
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_nodes_insert] 
 @name varchar(100)--节点名称
,@type varchar(20)--节点类型
,@flow_id int--流程编号
,@gf_id varchar(50)--节点编号
,@can_cancel int--是否可取消
,@page_type varchar(50)--页面类型
,@status varchar(50)--状态
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_nodes]
          (
           [name]
,[type]
,[flow_id]
,[gf_id]
,[can_cancel]
,[page_type]
,[status]
          )
        values(   
         @name
,@type
,@flow_id
,@gf_id
,@can_cancel
,@page_type
,@status
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_nodes_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_nodes_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_nodes] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_nodes] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'type' AND @desc = 'desc' THEN [type] END DESC , CASE WHEN @sort = 'type' AND @desc = 'asc' THEN [type] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'gf_id' AND @desc = 'desc' THEN [gf_id] END DESC , CASE WHEN @sort = 'gf_id' AND @desc = 'asc' THEN [gf_id] END ASC ,
									CASE WHEN @sort = 'can_cancel' AND @desc = 'desc' THEN [can_cancel] END DESC , CASE WHEN @sort = 'can_cancel' AND @desc = 'asc' THEN [can_cancel] END ASC ,
									CASE WHEN @sort = 'page_type' AND @desc = 'desc' THEN [page_type] END DESC , CASE WHEN @sort = 'page_type' AND @desc = 'asc' THEN [page_type] END ASC ,
									CASE WHEN @sort = 'status' AND @desc = 'desc' THEN [status] END DESC , CASE WHEN @sort = 'status' AND @desc = 'asc' THEN [status] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_nodes] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_nodes_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_nodes数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_nodes_update] 
 @id int--编号
,@name varchar(100)--节点名称
,@type varchar(20)--节点类型
,@flow_id int--流程编号
,@gf_id varchar(50)--节点编号
,@can_cancel int--是否可取消
,@page_type varchar(50)--页面类型
,@status varchar(50)--状态
 
 
 AS
    BEGIN 
       		--更新表flow_nodes
          UPDATE  [flow_nodes]
        SET   
         [name] =  @name
,[type] =  @type
,[flow_id] =  @flow_id
,[gf_id] =  @gf_id
,[can_cancel] =  @can_cancel
,[page_type] =  @page_type
,[status] =  @status
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow] WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow] WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'flow_name' AND @desc = 'desc' THEN [flow_name] END DESC , CASE WHEN @sort = 'flow_name' AND @desc = 'asc' THEN [flow_name] END ASC ,
									CASE WHEN @sort = 'flow_description' AND @desc = 'desc' THEN [flow_description] END DESC , CASE WHEN @sort = 'flow_description' AND @desc = 'asc' THEN [flow_description] END ASC ,
									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
									CASE WHEN @sort = 'column_name' AND @desc = 'desc' THEN [column_name] END DESC , CASE WHEN @sort = 'column_name' AND @desc = 'asc' THEN [column_name] END ASC ,
									CASE WHEN @sort = 'id_column_name' AND @desc = 'desc' THEN [id_column_name] END DESC , CASE WHEN @sort = 'id_column_name' AND @desc = 'asc' THEN [id_column_name] END ASC ,
									CASE WHEN @sort = 'deadline_column_name' AND @desc = 'desc' THEN [deadline_column_name] END DESC , CASE WHEN @sort = 'deadline_column_name' AND @desc = 'asc' THEN [deadline_column_name] END ASC ,
									CASE WHEN @sort = 'flow_type' AND @desc = 'desc' THEN [flow_type] END DESC , CASE WHEN @sort = 'flow_type' AND @desc = 'asc' THEN [flow_type] END ASC ,
									CASE WHEN @sort = 'page_id' AND @desc = 'desc' THEN [page_id] END DESC , CASE WHEN @sort = 'page_id' AND @desc = 'asc' THEN [page_id] END ASC ,
									CASE WHEN @sort = 'test_deadline' AND @desc = 'desc' THEN [test_deadline] END DESC , CASE WHEN @sort = 'test_deadline' AND @desc = 'asc' THEN [test_deadline] END ASC ,
									CASE WHEN @sort = 'test_status' AND @desc = 'desc' THEN [test_status] END DESC , CASE WHEN @sort = 'test_status' AND @desc = 'asc' THEN [test_status] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_recreate_status]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_flow_recreate_status]
@flow_id INT =3,
@add_by INT =1
AS
BEGIN

DELETE flow_status
WHERE flow_id = @flow_id

INSERT INTO dbo.flow_status
				        ( add_on ,
				          flow_id ,
				          status ,
				          status_text
				        )
				 SELECT GETDATE(),
				 @flow_id,
				 status, 
				 name
				 FROM dbo.flow_nodes
				 WHERE flow_id = @flow_id


end

GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_status_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：删除表flow_status数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_status_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [flow_status]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_status_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//       描述：插入数据到表flow_status
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_status_insert]  @flow_id int--流程编号
,@status varchar(20)--状态
,@status_text varchar(120)--状态名
 
 
 AS
    BEGIN 
       
       
          Insert into  [flow_status]
          (
           [add_on]
,[flow_id]
,[status]
,[status_text]
          )
        values(   
         GETDATE()
,@flow_id
,@status
,@status_text
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_status_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_status_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@flow_id int--流程编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [flow_status] WITH ( NOLOCK ) 
        	 where   @flow_id=flow_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [flow_status] WITH ( NOLOCK ) 
                	 where   @flow_id=flow_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'flow_id' AND @desc = 'desc' THEN [flow_id] END DESC , CASE WHEN @sort = 'flow_id' AND @desc = 'asc' THEN [flow_id] END ASC ,
									CASE WHEN @sort = 'status' AND @desc = 'desc' THEN [status] END DESC , CASE WHEN @sort = 'status' AND @desc = 'asc' THEN [status] END ASC ,
									CASE WHEN @sort = 'status_text' AND @desc = 'desc' THEN [status_text] END DESC , CASE WHEN @sort = 'status_text' AND @desc = 'asc' THEN [status_text] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [flow_status] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_status_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow_status数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_status_update] 
 @id int--编号
,@status varchar(20)--状态
,@status_text varchar(120)--状态名
 
 
 AS
    BEGIN 
       		--更新表flow_status
          UPDATE  [flow_status]
        SET   
         [status] =  @status
,[status_text] =  @status_text
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_flow_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf  
//			  
//       描述：更新表flow数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_flow_update] 
 @id int--编号
,@add_on datetime--	编号
,@add_by int--创建人
,@flow_name varchar(50)--流程名
,@flow_description varchar(500)--	流程名
,@table_name varchar(150)--表名
,@column_name varchar(150)--状态列名
,@id_column_name varchar(150)--主列名
,@deadline_column_name varchar(150)--过期日列名
,@flow_type varchar(50)--流程类型 1=单页流程图模式 2=多页模式 3=流程图内编辑模式 4=流程图内页面混合模式
,@page_id int--页面编号
,@test_deadline datetime--测试过期日期
,@test_status varchar(20)--测试状态
 
 
 AS
    BEGIN 
       		--更新表flow
          UPDATE  [flow]
        SET   
         [add_on] =  @add_on
,[add_by] =  @add_by
,[flow_name] =  @flow_name
,[flow_description] =  @flow_description
,[table_name] =  @table_name
,[column_name] =  @column_name
,[id_column_name] =  @id_column_name
,[deadline_column_name] =  @deadline_column_name
,[flow_type] =  @flow_type
,[page_id] =  @page_id
,[test_deadline] =  @test_deadline
,[test_status] =  @test_status
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_gat_all_action_by_uids]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_gat_all_action_by_uids]
    @role_ids VARCHAR(30) = '1'
AS
    BEGIN
 
        SELECT DISTINCT
                CAST(a.id AS VARCHAR(20)) id ,
				a.auth_flag,
                rb.role_id
        FROM    dbo.vd_Role_Menu_Button rb
                JOIN dbo.vd_Menu m ON m.id = rb.menu_id
                JOIN dbo.vd_Button b ON rb.button_id = b.id
                JOIN dbo.vd_Action a ON a.button_name = b.button_code
                                        AND a.menu_code = m.menu_code
										--WHERE
                                        -- a.id =119

--WHERE rb.role_id IN (SELECT  
 --                                  col FROM dbo.fn_splitStr(@role_ids,',')) 
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_Base_User_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_get_Base_User_detail] @user_id INT
AS
    BEGIN
        SELECT  *
        FROM    dbo.vd_User
        WHERE   id = @user_id

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_button]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_get_button]
    @user_id INT = 1 ,
    @menu_code VARCHAR(30) = 'admin_page'
AS
    BEGIN
        IF  @menu_code LIKE '%DDD%' 
            BEGIN
    
	  PRINT 'o1'
                IF EXISTS ( SELECT  1
                            FROM    vd_Button a
                                    JOIN vd_menu_button b ON a.id = b.button_id
                                    JOIN dbo.vd_Menu m ON b.menu_id = m.id
                                                          AND m.menu_code = @menu_code
                            WHERE   a.[enabled] = 1
                                    AND a.id IN (
                                    SELECT DISTINCT
                                            button_id
                                    FROM    vd_Role_Menu_Button
                                    WHERE   menu_code = @menu_code
                                            AND role_id IN (
                                            SELECT  role_id
                                            FROM    vd_User_Role
                                            WHERE   user_id = @user_id ) ) )
                    BEGIN
					
	  PRINT 'o2'
                        SELECT  a.button_code ,
                                ( CASE b.button_text
                                    WHEN '' THEN a.button_name
                                    ELSE b.button_text
                                  END ) AS button_name ,
                                b.button_sort AS sort ,
                                a.button_type ,
                                a.icon_class ,
                                a.js_event
                        FROM    vd_Button a
                                JOIN vd_menu_button b ON a.id = b.button_id
                                JOIN dbo.vd_Menu m ON b.menu_id = m.id
                                                      AND m.menu_code = @menu_code
                        WHERE   a.[enabled] = 1
                                AND a.id IN (
                                SELECT DISTINCT
                                        button_id
                                FROM    vd_Role_Menu_Button
                                WHERE   menu_code = @menu_code
                                        AND role_id IN (
                                        SELECT  role_id
                                        FROM    vd_User_Role
                                        WHERE   user_id = @user_id ) )
                        ORDER BY b.button_sort; 
                    END;
        

                ELSE
                    BEGIN
					
	  PRINT 'o3'

                        SET @menu_code = SUBSTRING(@menu_code, 0,
                                                  CHARINDEX('DDD', @menu_code));
												  PRINT @menu_code
                                                  
                        SELECT  a.button_code ,
                                ( CASE b.button_text
                                    WHEN '' THEN a.button_name
                                    ELSE b.button_text
                                  END ) AS button_name ,
                                b.button_sort AS sort ,
                                a.button_type ,
                                a.icon_class ,
                                a.js_event
                        FROM    vd_Button a
                                JOIN vd_menu_button b ON a.id = b.button_id
                                JOIN dbo.vd_Menu m ON b.menu_id = m.id
                                                      AND m.menu_code = @menu_code
                        WHERE   a.[enabled] = 1
                                AND a.id IN (
                                SELECT DISTINCT
                                        button_id
                                FROM    vd_Role_Menu_Button
                                WHERE   menu_code = @menu_code
                                        AND role_id IN (
                                        SELECT  role_id
                                        FROM    vd_User_Role
                                        WHERE   user_id = @user_id ) )
                        ORDER BY b.button_sort; 
                    END;





            END;
        ELSE
		BEGIN
		
	  PRINT 'o4'
            SELECT  a.button_code ,
                    ( CASE b.button_text
                        WHEN '' THEN a.button_name
                        ELSE b.button_text
                      END ) AS button_name ,
                    b.button_sort AS sort ,
                    a.button_type ,
                    a.icon_class ,
                    a.js_event
            FROM    vd_Button a
                    JOIN vd_menu_button b ON a.id = b.button_id
                    JOIN dbo.vd_Menu m ON b.menu_id = m.id
                                          AND m.menu_code = @menu_code
            WHERE   a.[enabled] = 1
                    AND a.id IN (
                    SELECT DISTINCT
                            button_id
                    FROM    vd_Role_Menu_Button
                    WHERE   menu_code = @menu_code
                            AND role_id IN ( SELECT  role_id
                                            FROM    vd_User_Role
                                            WHERE   user_id = @user_id ) )
            ORDER BY b.button_sort; 
			END
            
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_button2]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_get_button2]
    @user_id INT = 1 ,
    @menu_code VARCHAR(30)='admin_page'
AS
    BEGIN
        SELECT  a.button_code ,
                ( CASE b.button_text
                    WHEN '' THEN a.button_name
                    ELSE b.button_text
                  END ) AS button_name ,
                b.button_sort AS sort ,
                a.button_type ,
                a.icon_class ,
                a.js_event
        FROM    vd_Button a
                JOIN vd_menu_button b ON a.id = b.button_id
				JOIN dbo.vd_Menu m ON b.menu_id = m.id
                                        AND  m.menu_code =@menu_code
        WHERE   a.[enabled] = 1
                AND a.id IN (
                SELECT DISTINCT
                        button_id
                FROM    vd_Role_Menu_Button
                WHERE   menu_code =@menu_code
                        AND role_id IN ( SELECT  role_id
                                        FROM    vd_User_Role
                                        WHERE   user_id = @user_id ) )
        ORDER BY b.button_sort 

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_menu]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
select * from vd_user


  SELECT  *
        FROM    vd_Menu
        WHERE   enabled = 1
                AND id IN ( SELECT  menu_id
                            FROM    vd_Role_Menu
                            WHERE   role_id IN ( SELECT  role_id
                                                FROM    vd_User_Role
                                                WHERE   user_id = 1 ) )

*/
 
alter  PROC [dbo].[vdp_get_menu] @role_ids VARCHAR(30)='2,3'
-- @userid INT = 2
AS
    BEGIN

	  
        SELECT   id,
		  menu_token,
                menu_code ,
                menu_name ,
                parent_id ,
                menu_type ,
                button_mode ,
                url ,
                icon_class,dbo.uf_get_icon( icon_class)  icon --,
                --icon_url ,
                --sort ,
                --enabled ,
                --remark ,
                --add_by ,
                --add_on
        FROM    vd_Menu
        WHERE   enabled = 1 AND visible_flag = 1
                AND id IN ( SELECT  menu_id
                            FROM    vd_Role_Menu
                            WHERE   role_id IN ( 
							SELECT  
                                   col FROM dbo.fn_splitStr(@role_ids,',')) )
        ORDER BY sort
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_page_data]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_get_page_data] @pid INT= 14,
@parent_id int
AS
    BEGIN

        SELECT  p.id ,
                p.template_id ,
                p.page_name ,
                p.description ,
                --p.parent_menu_code ,
                --p.add_on ,
                p.page_name_text ,
                --p.controller_area ,
                --p.controller ,
                p.language ,
                p.parent_id ,
                pd.id pdid,
                --pd.page_id ,
                --pd.area ,
                pd.table_name ,
                pd.module_id --,
                --pd.comments ,
                --pd.name_text ,
                ,pd.class_name
        FROM    dbo.vd_page p
                JOIN dbo.vd_page_detail pd ON p.id = pd.page_id
        WHERE  ( @parent_id =-1   and pd.id = @pid) or (@parent_id <>-1 and p.id = @pid);

    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_page_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_get_page_detail]
    @page_id INT ,
    @file_name VARCHAR(30)
AS
    BEGIN

        SELECT  *
        FROM    dbo.vd_page
        WHERE   id = @page_id
        UPDATE  dbo.vd_Source
        SET     publish_flag = 1
        WHERE   page_id = @page_id
                AND [file_name] = @file_name 
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_page_detail_for_gen_client]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--SELECT TOP 10 * FROM dbo.vd_page_detail ORDER BY id desc
 /*
 [vdp_get_page_detail_for_gen_client] 38
 */
alter   PROCEDURE [dbo].[vdp_get_page_detail_for_gen_client]
    @page_detail_id INT = 38
AS
    BEGIN  
				
   
        DECLARE @PrimaryField VARCHAR(30)
        DECLARE @table_name VARCHAR(30)

        SET @PrimaryField = ''

        SELECT  @table_name = v.table_name
        FROM    [dbo].[vd_page_detail_config] c
                JOIN dbo.v_table v ON c.column_name = v.column_name
                                      AND c.table_name = v.table_name
        WHERE   page_detail_id = @page_detail_id  


		
        SELECT  @PrimaryField = v.column_name
        FROM    dbo.v_table v
        WHERE   @table_name = v.table_name
                AND ( flag_identity = '√'
                      OR flag_primary = '√'
                    )

        SELECT  id ,
                page_detail_id ,
                is_show ,
                is_where ,
                is_insert ,
                is_update ,
                width ,
                data ,
                valid ,
                is_required ,
                c.column_name ,
               -- c.column_description ,
                column_type ,
                column_length ,
                html_type ,
                static_value ,
                table_name ,
                table_name ,
                table_description ,
                column_order ,
                v.column_name ,
               CASE WHEN flag_identity = '√'
                      OR flag_primary = '√' THEN 1 ELSE 0 END flag_identity ,
                CASE WHEN flag_identity = '√'
                      OR flag_primary = '√' THEN 1 ELSE 0 END flag_primary ,
                type ,
                size ,
                length ,
                decimal_number ,
                flag_nullable ,
                default_value ,
          --  ISNULL(c.column_description, v.column_description) column_description ,
				c.col_alias column_description,
                ISNULL(column_caption, c.column_description) column_caption ,
                @PrimaryField PrimaryField,
			CASE WHEN flag_identity = '√'
                      OR flag_primary = '√' THEN 1 ELSE 0 END isidentity
        FROM    dbo.v_table v
                LEFT  JOIN [dbo].[vd_page_detail_config] c ON ( c.column_name = v.column_name )
                                                              AND c.table_name = v.table_name
        WHERE   page_detail_id = @page_detail_id
             --   AND v.column_name <> @PrimaryField
   --     UNION
   --     SELECT  0 ,
   --             @page_detail_id page_detail_id ,
   --             1 is_show ,
   --             0 is_where ,
   --             0 is_insert ,
   --             0 is_update ,
   --             0 width ,
   --             '' data ,
   --             '' valid ,
   --             0 is_required ,
   --             @PrimaryField column_name ,
   --            -- c.column_description ,
   --             '' column_type ,
   --             0 column_length ,
   --             '' html_type ,
   --             '' static_value ,
   --             @table_name table_name ,
   --             table_name ,
   --             table_description ,
   --             column_order ,
   --             v.column_name ,
   --             1 flag_identity ,
   --             0 flag_primary ,
   --             type ,
   --             size ,
   --             length ,
   --             decimal_number ,
   --             flag_nullable ,
   --             default_value ,
   --             ISNULL(column_description, '') column_description ,
   --             ISNULL(column_caption, '') column_caption ,
   --             @PrimaryField PrimaryField,
			--CASE WHEN flag_identity = '√'
   --                   OR flag_primary = '√' THEN 1 ELSE 0 END isidentity
   --     FROM    dbo.v_table v
   --     WHERE   column_name = @PrimaryField
   --             AND table_name = @table_name

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_get_page_for_gen_client]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_get_page_for_gen_client] @page_id INT = 3
AS
    BEGIN 
    
        SELECT  *
        FROM    vd_page c 
        WHERE   c.id = @page_id

        SELECT  p.*
        FROM    dbo.vd_page_detail p 
        WHERE   page_id = @page_id 
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_get_proc_param_ddl]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_get_proc_param_ddl] @proc VARCHAR(100) = 'vdp_insert_action'
AS
    BEGIN


        SELECT  
                s.name  
        FROM    sys.parameters s
                JOIN sys.[types] t ON s.user_type_id = t.user_type_id
                LEFT JOIN dbo.vd_Proc_Parameters p ON p.parameter_name = s.name
        WHERE   object_id = OBJECT_ID(@proc)

    END


GO
/****** Object:  StoredProcedure [dbo].[vdp_get_SysColumnSetup_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 09:53:49
//       作者： Jerry 
//       描述：得到数据表SysColumnSetup详细信息
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_get_SysColumnSetup_detail]
    @table_name VARCHAR(50) ,
    @class_name VARCHAR(50)
AS
    BEGIN 
        SELECT *
        FROM    [SysColumnSetup] c
                JOIN dbo.SysTableSetup t ON c.table_id = t.id
        WHERE   t.table_name = @table_name
                AND t.class_name = @class_name
 					
        
    
    END


GO
/****** Object:  StoredProcedure [dbo].[vdp_get_SysTableSetup_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 09:12:26
//       作者： 蔡捷 
//       描述：得到数据表SysTableSetup详细信息
//------------------------------------------------------------------------------

*/


alter    PROCEDURE [dbo].[vdp_get_SysTableSetup_detail] @table_name VARCHAR(50)
AS
    BEGIN 
        IF EXISTS ( SELECT  1
                    FROM    [SysTableSetup]
                    WHERE   [table_name] = @table_name )
            SELECT  [table_name] ,
                    [class_name] ,
                    [author] ,
                    [comments] ,
                    [add_date] ,
                    [area_name] ,
                    [company]
            FROM    [SysTableSetup]
            WHERE   [table_name] = @table_name 
            order by id desc
        ELSE
            SELECT TOP 1
                    '' [table_name] ,
                    '' [class_name] ,
                    [author] ,
                    '' [comments] ,
                    [add_date] ,
                    [area_name] ,
                    [company]
            FROM    [SysTableSetup]
            ORDER BY id DESC
        
        
    END


GO
/****** Object:  StoredProcedure [dbo].[vdp_get_unsent_message]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter  PROC [dbo].[vdp_get_unsent_message]
AS
    BEGIN
        DECLARE @id INT;
        SELECT TOP 1
                @id = id
        FROM    wx_message
        WHERE   send_flag = 0;

        SELECT  *
        FROM    dbo.wx_message
        WHERE   id = @id;

        UPDATE  dbo.wx_message
        SET     send_flag = 1
        WHERE   id = @id;

    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_Action
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_Action]
    @menu_code VARCHAR(50) ,
    @action_url_name VARCHAR(50) ,
    @button_name VARCHAR(50) ,
    @procedure_name VARCHAR(150) ,
    @action_type VARCHAR(50),
	@auth_flag INT,
	@sql VARCHAR(MAX),
	@sql_type VARCHAR(20)
AS
    BEGIN 
       
       
        INSERT  INTO [vd_Action]
                ( [menu_code] ,
                  [action_url_name] ,
                  [button_name] ,
                  [procedure_name] ,
                  [action_type],
				  auth_flag,[sql],sql_type, action_url
                )
        VALUES  ( @menu_code ,
                  @action_url_name ,
                  @button_name ,
                  @procedure_name ,
                  @action_type,
				  @auth_flag,@sql, @sql_type, ''
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_Base_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//       描述：插入数据到表Base_Action
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_Base_Action]
    @menu_code VARCHAR(50) ,
    @action_url_name VARCHAR(50) ,
    @button_name VARCHAR(50) ,
    @procedure_name VARCHAR(150) ,
    @action_type VARCHAR(50) ,
    @comments NVARCHAR(2000) ,
    @auth_flag INT ,
    @sql VARCHAR(MAX) ,
    @sql_type VARCHAR(20) ,
    @conn_str VARCHAR(20)
AS
    BEGIN 
        IF @conn_str = ''
            SET @conn_str = 'app';
       
        INSERT  INTO [vd_action]
                ( [menu_code] ,
                  [action_url_name] ,
                  [button_name] ,
                  [procedure_name] ,
                  [action_type] ,
                  comments ,
                  auth_flag ,
                  sql ,
                  sql_type ,
                  conn_str ,
                  action_url
                )
        VALUES  ( @menu_code ,
                  @action_url_name ,
                  @button_name ,
                  @procedure_name ,
                  @action_type ,
                  @comments ,
                  @auth_flag ,
                  @sql ,
                  @sql_type ,
                  @conn_str ,
                  ''
                );
        
    
        EXEC sys_add_proc_old @menu_code = @menu_code,
            @action_name = @action_url_name, @button_name = @button_name,
            @proc_name = @procedure_name, @action_type = @action_type,
            @comments = @comments;
    END; 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_Base_Procedure_Parameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//       描述：插入数据到表Base_Procedure_Parameters
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_insert_Base_Procedure_Parameters] 
 @procedure_name varchar(50)
,@parameter_name varchar(50)
,@parameter_type varchar(300)
,@max_length int
,@is_out int
,@from__where varchar(150)
 
 
 AS
    BEGIN 
       
       
          Insert into  vd_Proc_Parameters
          (
           [procedure_name]
,[parameter_name]
,[parameter_type]
,[max_length]
,[is_out]
,[from__where]
          )
        values(   
         @procedure_name
,@parameter_name
,@parameter_type
,@max_length
,@is_out
,@from__where
      )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_ProcParameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//       描述：插入数据到表Base_Procedure_Parameters
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_ProcParameters]
    @procedure_name VARCHAR(50) ,
    @parameter_name VARCHAR(50) ,
    @parameter_type VARCHAR(300) ,
    @max_length INT ,
    @is_out INT ,
    @from__where VARCHAR(150)
AS
    BEGIN 
       
       
        INSERT  INTO [vd_Proc_Parameters]
                ( [procedure_name] ,
                  [parameter_name] ,
                  [parameter_type] ,
                  [max_length] ,
                  [is_out] ,
                  [from__where]
                )
        VALUES  ( @procedure_name ,
                  @parameter_name ,
                  @parameter_type ,
                  @max_length ,
                  @is_out ,
                  @from__where
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_vd_module]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_module
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_vd_module]
    @template_id INT ,
    @module_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @files_text NVARCHAR(1000) ,
    @edit_flag INT ,
    @language  VARCHAR(50),
    @js_framwork  VARCHAR(50)
AS
    BEGIN 
       
       
        INSERT  INTO [vd_module]
                ( [template_id] ,
                  [module_name] ,
                  [description] ,
                  [files_text] ,
                  edit_flag,
				  [language],js_framwork
                )
        VALUES  ( @template_id ,
                  @module_name ,
                  @description ,
                  @files_text ,
                  @edit_flag,@language,@js_framwork
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_vd_page]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_page
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_vd_page]
    @template_id INT ,
    @page_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @parent_menu_code VARCHAR(20) ,
    @page_name_text VARCHAR(50),
	@controller_area VARCHAR(50),
	@controller  VARCHAR(50)
AS
    BEGIN 
	DECLARE  @m VARCHAR(60)
        IF EXISTS(SELECT 1 FROM [vd_page] WHERE [page_name] = @page_name)
	   BEGIN
	    
	   SET @m=@page_name +'已经存在'
	   Raiserror( @m,16,1)    
	   RETURN
       

	   END
       
        INSERT  INTO [vd_page]
                ( [template_id] ,
                  [page_name] ,
                  [description] ,
                  [parent_menu_code] ,
                  page_name_text, 
				  controller_area,
				  controller
                )
        VALUES  ( @template_id ,
                  @page_name ,
                  @description ,
                  @parent_menu_code ,
                  @page_name_text,
				  @controller_area,
				  @controller
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_vd_page_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_page_detail
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_vd_page_detail]
    @page_id INT ,
    @area VARCHAR(10) ,
    @table_name VARCHAR(50) ,
    @class_name VARCHAR(50) ,
    @module_id INT ,
    @comments VARCHAR(2000) ,
    @name_text VARCHAR(50)
AS
    BEGIN 
       DECLARE @page_detail_id int
	   IF @class_name=''
	   SET @class_name = @table_name
       
        INSERT  INTO [vd_page_detail]
                ( [page_id] ,
                  [area] ,
                  [table_name] ,
                  [module_id] ,
                  [comments] ,
                  name_text ,
                  class_name
                )
        VALUES  ( @page_id ,
                  @area ,
                  @table_name ,
                  @module_id ,
                  @comments ,
                  @name_text ,
                  @class_name
                )
        SET @page_detail_id = @@IDENTITY
	   EXEC vdp_update_config @page_detail_id
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_vd_Source]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-15
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_Source
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_vd_Source]
    @file_name VARCHAR(200) ,
    @file_type VARCHAR(10) ,
    @add_by INT ,
    @page_id INT
AS
    BEGIN 
       
	   IF NOT EXISTS( SELECT 1 FROM vd_source WHERE @file_name =  [file_name] AND page_id =@page_id) 
       
        INSERT  INTO [vd_Source]
                ( [file_name] ,
                  [file_type] ,
                  [add_by] ,
                  [add_on] ,
                  [publish_flag] ,
                  [page_id]
                )
        VALUES  ( @file_name ,
                  @file_type ,
                  @add_by ,
                  GETDATE() ,
                  0 ,
                  @page_id
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_insert_vd_template]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_template
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_insert_vd_template]
    @template_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @files VARCHAR(300) ,
    @html VARCHAR(2000) ,
    @areas VARCHAR(150) ,
    @language VARCHAR(50) ,
    @js_framwork VARCHAR(50)
AS
    BEGIN 
       
       
        INSERT  INTO [vd_template]
                ( [template_name] ,
                  [description] ,
                  [files] ,
                  [html] ,
                  [areas] ,
                  [language] ,
                  js_framwork
                )
        VALUES  ( @template_name ,
                  @description ,
                  @files ,
                  @html ,
                  @areas ,
                  @language ,
                  @js_framwork
                )
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_json_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 alter   PROCEDURE [dbo].[vdp_json_list] 
  	@id int
AS
    BEGIN 
          select 
           [id]  [id] 
,[name]  [text] 
From  [test_user]
        
    	-- where   @id>id
END 

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_action] 
AS

BEGIN

SELECT * FROM dbo.vd_Action

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_Action_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_Action_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10) ,
    @pmenu_code VARCHAR(30)
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Action WITH ( NOLOCK )
        WHERE   Menu_Code = @pmenu_code
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_Action
                WHERE   Menu_Code = @pmenu_code
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'desc' THEN menu_code
                        END DESC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'asc' THEN menu_code
                        END ASC ,
                        CASE WHEN @sort = 'action_url_name'
                                  AND @desc = 'desc' THEN action_url_name
                        END DESC ,
                        CASE WHEN @sort = 'action_url_name'
                                  AND @desc = 'asc' THEN action_url_name
                        END ASC ,
                        CASE WHEN @sort = 'action_url'
                                  AND @desc = 'desc' THEN action_url
                        END DESC ,
                        CASE WHEN @sort = 'action_url'
                                  AND @desc = 'asc' THEN action_url
                        END ASC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'desc' THEN button_name
                        END DESC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'asc' THEN button_name
                        END ASC ,
                        CASE WHEN @sort = 'procedure_name'
                                  AND @desc = 'desc' THEN procedure_name
                        END DESC ,
                        CASE WHEN @sort = 'procedure_name'
                                  AND @desc = 'asc' THEN procedure_name
                        END ASC ,
                        CASE WHEN @sort = 'action_type'
                                  AND @desc = 'desc' THEN action_type
                        END DESC ,
                        CASE WHEN @sort = 'action_type'
                                  AND @desc = 'asc' THEN action_type
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Action c
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_action_type]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_action_type]
AS
BEGIN
	SELECT type id, type_name text
	FROM dbo.vd_action_type
end
GO
/****** Object:  StoredProcedure [dbo].[vdp_list_action2]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_action2] 
AS

BEGIN

SELECT * FROM dbo.vd_Action

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_all_buttons]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_list_all_buttons]
AS
    BEGIN
        SELECT  b.icon_class ,
                mb.button_text ,
                b.id ,
                mb.menu_id
        FROM    dbo.vd_menu_button mb
                JOIN dbo.vd_Button b ON mb.button_id = b.id
				ORDER BY sort

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_Base_Action_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------
[vdp_list_Base_Action_pager] 1,5,2, '','',
'user_test_edit'
select * from vd_button
*/


alter   PROCEDURE [dbo].[vdp_list_Base_Action_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10) ,
    @pmenu_code VARCHAR(30)
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Action WITH ( NOLOCK )
        WHERE   Menu_Code = @pmenu_code
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_Action
                WHERE   Menu_Code = @pmenu_code
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'desc' THEN menu_code
                        END DESC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'asc' THEN menu_code
                        END ASC ,
                        CASE WHEN @sort = 'action_url_name'
                                  AND @desc = 'desc' THEN action_url_name
                        END DESC ,
                        CASE WHEN @sort = 'action_url_name'
                                  AND @desc = 'asc' THEN action_url_name
                        END ASC ,
                        CASE WHEN @sort = 'action_url'
                                  AND @desc = 'desc' THEN action_url
                        END DESC ,
                        CASE WHEN @sort = 'action_url'
                                  AND @desc = 'asc' THEN action_url
                        END ASC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'desc' THEN button_name
                        END DESC ,
                        CASE WHEN @sort = 'button_name'
                                  AND @desc = 'asc' THEN button_name
                        END ASC ,
                        CASE WHEN @sort = 'procedure_name'
                                  AND @desc = 'desc' THEN procedure_name
                        END DESC ,
                        CASE WHEN @sort = 'procedure_name'
                                  AND @desc = 'asc' THEN procedure_name
                        END ASC ,
                        CASE WHEN @sort = 'action_type'
                                  AND @desc = 'desc' THEN action_type
                        END DESC ,
                        CASE WHEN @sort = 'action_type'
                                  AND @desc = 'asc' THEN action_type
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*, ISNULL(at.code_help, '')  code_help ,ISNULL(b.js_event,'') 
		js_event 
        FROM    vd_Action c
                JOIN @table o ON c.id = o.id
			LEFT
				JOIN dbo.vd_action_type at ON c.action_type = at.type 
				LEFT JOIN dbo.vd_button b ON c.button_name = b.button_code
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_Base_Menu_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 19:36:02
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_Base_Menu_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              menu_code VARCHAR(64)
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Menu WITH ( NOLOCK ) 
        WHERE add_on >'2017-01-12 06:54:00' AND url <>'#'
       
        INSERT  INTO @table
                ( menu_code
		        )
                SELECT TOP ( @start_index + @page_size )
                        menu_code
                FROM    vd_Menu
        WHERE add_on >'2017-01-12 06:54:00'  AND url <>'#'
                ORDER BY CASE WHEN @sort = 'menu_code'
                                   AND @desc = 'desc' THEN menu_code
                         END DESC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'asc' THEN menu_code
                        END ASC ,
                        CASE WHEN @sort = 'menu_name'
                                  AND @desc = 'desc' THEN menu_name
                        END DESC ,
                        CASE WHEN @sort = 'menu_name'
                                  AND @desc = 'asc' THEN menu_name
                        END ASC ,
                        CASE WHEN @sort = 'parent_id'
                                  AND @desc = 'desc' THEN parent_id
                        END DESC ,
                        CASE WHEN @sort = 'parent_id'
                                  AND @desc = 'asc' THEN parent_id
                        END ASC ,
                        CASE WHEN @sort = 'menu_type'
                                  AND @desc = 'desc' THEN menu_type
                        END DESC ,
                        CASE WHEN @sort = 'menu_type'
                                  AND @desc = 'asc' THEN menu_type
                        END ASC ,
                        CASE WHEN @sort = 'button_mode'
                                  AND @desc = 'desc' THEN button_mode
                        END DESC ,
                        CASE WHEN @sort = 'button_mode'
                                  AND @desc = 'asc' THEN button_mode
                        END ASC ,
                        CASE WHEN @sort = 'url'
                                  AND @desc = 'desc' THEN url
                        END DESC ,
                        CASE WHEN @sort = 'url'
                                  AND @desc = 'asc' THEN url
                        END ASC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'desc' THEN icon_class
                        END DESC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'asc' THEN icon_class
                        END ASC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'desc' THEN icon_url
                        END DESC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'asc' THEN icon_url
                        END ASC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'desc' THEN sort
                        END DESC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'asc' THEN sort
                        END ASC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'desc' THEN enabled
                        END DESC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'asc' THEN enabled
                        END ASC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'desc' THEN remark
                        END DESC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'asc' THEN remark
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'desc' THEN id
                        END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        --CASE WHEN @sort = 'edit_by'
                        --          AND @desc = 'desc' THEN edit_by
                        --END DESC ,
                        --CASE WHEN @sort = 'edit_by'
                        --          AND @desc = 'asc' THEN edit_by
                        --END ASC ,
                        --CASE WHEN @sort = 'edit_on'
                        --          AND @desc = 'desc' THEN edit_on
                        --END DESC ,
                        --CASE WHEN @sort = 'edit_on'
                        --          AND @desc = 'asc' THEN edit_on
                        --END ASC ,
                        CASE WHEN @sort = ' ' THEN menu_code
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Menu c
                JOIN @table o ON c.menu_code = o.menu_code
        ORDER BY o.new_index 
    
    END 
    




GO
/****** Object:  StoredProcedure [dbo].[vdp_list_Base_Procedure_Parameters_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_list_Base_Procedure_Parameters_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id  int
 ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Proc_Parameters WITH ( NOLOCK ) 
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    vd_Proc_Parameters
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'procedure_name' AND @desc = 'desc' THEN procedure_name END DESC , CASE WHEN @sort = 'procedure_name' AND @desc = 'asc' THEN procedure_name END ASC ,
									CASE WHEN @sort = 'parameter_name' AND @desc = 'desc' THEN parameter_name END DESC , CASE WHEN @sort = 'parameter_name' AND @desc = 'asc' THEN parameter_name END ASC ,
									CASE WHEN @sort = 'parameter_type' AND @desc = 'desc' THEN parameter_type END DESC , CASE WHEN @sort = 'parameter_type' AND @desc = 'asc' THEN parameter_type END ASC ,
									CASE WHEN @sort = 'max_length' AND @desc = 'desc' THEN max_length END DESC , CASE WHEN @sort = 'max_length' AND @desc = 'asc' THEN max_length END ASC ,
									CASE WHEN @sort = 'is_out' AND @desc = 'desc' THEN is_out END DESC , CASE WHEN @sort = 'is_out' AND @desc = 'asc' THEN is_out END ASC ,
									CASE WHEN @sort = 'from__where' AND @desc = 'desc' THEN from__where END DESC , CASE WHEN @sort = 'from__where' AND @desc = 'asc' THEN from__where END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Proc_Parameters c
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_button]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-04-20 12:56:17
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_button] 
AS
    BEGIN 
       SELECT DISTINCT button_code id, button_name text,sort FROM dbo.vd_button
	   ORDER BY  sort
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_department_tree]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_list_department_tree] @department_id INT = 4
AS
    BEGIN
        IF EXISTS ( SELECT  1
                    FROM    dbo.vd_Department
                    WHERE   parent_id = @department_id )
            WITH    cte_child ( [text], id, pid, level )
                      AS (
 
 
                 
                       
    --起始条件
                           SELECT   department_name [text] ,
                                    id id ,
                                    parent_id pid ,
                                    0 AS level
                           FROM     vd_Department
                           WHERE    id = @department_id--列出父节点查询条件
                           UNION ALL 
 
    --递归条件
                           SELECT   a.department_name [text] ,
                                    a.id id ,
                                    a.parent_id pid ,
                                    b.level + 1
                           FROM     dbo.vd_Department a
                                    INNER JOIN cte_child b ON ( a.parent_id = b.id )
                         )
                SELECT  c.* ,
                        'open' STATE ,
                        d.*
                FROM    cte_child c
                        JOIN dbo.vd_Department d ON d.id = c.id;
        ELSE
            BEGIN
                SELECT  d1.department_name [text] ,
                        d1.id id ,
                        d1.parent_id pid ,
                        1 AS level
                FROM    vd_Department d1
                WHERE   d1.id = @department_id;
					 
            END;
 
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_js_framwork]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_js_framwork]
AS
BEGIN
	SELECT 'easyui' id,
	'easyui' text
	union
	SELECT 'bootstrap' id,
	'bootstrap' text 

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_language]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_language]
AS
BEGIN
	SELECT 'mssql.net' id,
	'mssql.net' text
	union
	SELECT 'InformixJava' id,
	'InformixJava' text
	union
	SELECT 'OracleJava' id,
	'OracleJava' text
	union
	SELECT 'MySQLJava' id,
	'MySQLJava' text
	union
	SELECT 'MySQLPHP' id,
	'MySQLPHP' text
	union
	SELECT 'InformixJava' id,
	'InformixJava' text

end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_proc]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_proc]
AS
BEGIN
SELECT id, name from  sysobjects where [type]='P'
ORDER BY name
end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_ProcParameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_list_ProcParameters]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id  int
 ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [vd_Proc_Parameters] WITH ( NOLOCK ) 
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [vd_Proc_Parameters]
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'procedure_name' AND @desc = 'desc' THEN procedure_name END DESC , CASE WHEN @sort = 'procedure_name' AND @desc = 'asc' THEN procedure_name END ASC ,
									CASE WHEN @sort = 'parameter_name' AND @desc = 'desc' THEN parameter_name END DESC , CASE WHEN @sort = 'parameter_name' AND @desc = 'asc' THEN parameter_name END ASC ,
									CASE WHEN @sort = 'parameter_type' AND @desc = 'desc' THEN parameter_type END DESC , CASE WHEN @sort = 'parameter_type' AND @desc = 'asc' THEN parameter_type END ASC ,
									CASE WHEN @sort = 'max_length' AND @desc = 'desc' THEN max_length END DESC , CASE WHEN @sort = 'max_length' AND @desc = 'asc' THEN max_length END ASC ,
									CASE WHEN @sort = 'is_out' AND @desc = 'desc' THEN is_out END DESC , CASE WHEN @sort = 'is_out' AND @desc = 'asc' THEN is_out END ASC ,
									CASE WHEN @sort = 'from__where' AND @desc = 'desc' THEN from__where END DESC , CASE WHEN @sort = 'from__where' AND @desc = 'asc' THEN from__where END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [vd_Proc_Parameters] c
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_product]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_list_product]
@Parameter VARCHAR(20)
AS
BEGIN
SELECT id, name from  sysobjects where [type]='P'
ORDER BY name
end

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_RoleMenu]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_list_RoleMenu]
AS
    BEGIN
        SELECT  *
        FROM    dbo.vd_Role_Menu  

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_RoleMenuButton]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

alter  PROC [dbo].[vdp_list_RoleMenuButton]
AS
    BEGIN
        SELECT  *
        FROM    dbo.vd_Role_Menu_Button  

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_list_user]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-04-20 12:56:17
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_user] 
AS
    BEGIN 
       
        SELECT   c.id, c.real_name text
        FROM    vd_User c
                 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_module_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_vd_module_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
	--,
	--@template_id int
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_module WITH ( NOLOCK ) 
	--WHERE  template_id = @template_id
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_module
	--WHERE  template_id = @template_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'desc' THEN template_id
                        END DESC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'asc' THEN template_id
                        END ASC ,
                        CASE WHEN @sort = 'module_name'
                                  AND @desc = 'desc' THEN module_name
                        END DESC ,
                        CASE WHEN @sort = 'module_name'
                                  AND @desc = 'asc' THEN module_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = 'files_text'
                                  AND @desc = 'desc' THEN files_text
                        END DESC ,
                        CASE WHEN @sort = 'files_text'
                                  AND @desc = 'asc' THEN files_text
                        END ASC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'desc' THEN language
                        END DESC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'asc' THEN language
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_module c
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_page_detail_config_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------
exec [vdp_list_vd_page_detail_config_pager] 1,4, 0, '','', 13
select *
     FROM    dbo.vd_page_detail
        WHERE   id =13
*/


alter   PROCEDURE [dbo].[vdp_list_vd_page_detail_config_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10) ,
    @page_detail_id INT
AS
    BEGIN 
        DECLARE @start_index INT ,
            @table_name VARCHAR(30)
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
       
	   EXEC vdp_update_config @page_detail_id
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_page_detail_config WITH ( NOLOCK )
        WHERE   page_detail_id = @page_detail_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_page_detail_config
                WHERE   page_detail_id = @page_detail_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'page_detail_id'
                                  AND @desc = 'desc' THEN page_detail_id
                        END DESC ,
                        CASE WHEN @sort = 'page_detail_id'
                                  AND @desc = 'asc' THEN page_detail_id
                        END ASC ,
                        CASE WHEN @sort = 'is_show'
                                  AND @desc = 'desc' THEN is_show
                        END DESC ,
                        CASE WHEN @sort = 'is_show'
                                  AND @desc = 'asc' THEN is_show
                        END ASC ,
                        CASE WHEN @sort = 'is_where'
                                  AND @desc = 'desc' THEN is_where
                        END DESC ,
                        CASE WHEN @sort = 'is_where'
                                  AND @desc = 'asc' THEN is_where
                        END ASC ,
                        CASE WHEN @sort = 'is_insert'
                                  AND @desc = 'desc' THEN is_insert
                        END DESC ,
                        CASE WHEN @sort = 'is_insert'
                                  AND @desc = 'asc' THEN is_insert
                        END ASC ,
                        CASE WHEN @sort = 'is_update'
                                  AND @desc = 'desc' THEN is_update
                        END DESC ,
                        CASE WHEN @sort = 'is_update'
                                  AND @desc = 'asc' THEN is_update
                        END ASC ,
                        CASE WHEN @sort = 'width'
                                  AND @desc = 'desc' THEN width
                        END DESC ,
                        CASE WHEN @sort = 'width'
                                  AND @desc = 'asc' THEN width
                        END ASC ,
                        CASE WHEN @sort = 'data'
                                  AND @desc = 'desc' THEN data
                        END DESC ,
                        CASE WHEN @sort = 'data'
                                  AND @desc = 'asc' THEN data
                        END ASC ,
                        CASE WHEN @sort = 'valid'
                                  AND @desc = 'desc' THEN valid
                        END DESC ,
                        CASE WHEN @sort = 'valid'
                                  AND @desc = 'asc' THEN valid
                        END ASC ,
                        CASE WHEN @sort = 'is_required'
                                  AND @desc = 'desc' THEN is_required
                        END DESC ,
                        CASE WHEN @sort = 'is_required'
                                  AND @desc = 'asc' THEN is_required
                        END ASC ,
                        CASE WHEN @sort = 'column_name'
                                  AND @desc = 'desc' THEN column_name
                        END DESC ,
                        CASE WHEN @sort = 'column_name'
                                  AND @desc = 'asc' THEN column_name
                        END ASC ,
                        CASE WHEN @sort = 'column_description'
                                  AND @desc = 'desc' THEN column_description
                        END DESC ,
                        CASE WHEN @sort = 'column_description'
                                  AND @desc = 'asc' THEN column_description
                        END ASC ,
                        CASE WHEN @sort = 'column_type'
                                  AND @desc = 'desc' THEN column_type
                        END DESC ,
                        CASE WHEN @sort = 'column_type'
                                  AND @desc = 'asc' THEN column_type
                        END ASC ,
                        CASE WHEN @sort = 'column_length'
                                  AND @desc = 'desc' THEN column_length
                        END DESC ,
                        CASE WHEN @sort = 'column_length'
                                  AND @desc = 'asc' THEN column_length
                        END ASC ,
                        CASE WHEN @sort = 'html_type'
                                  AND @desc = 'desc' THEN html_type
                        END DESC ,
                        CASE WHEN @sort = 'html_type'
                                  AND @desc = 'asc' THEN html_type
                        END ASC ,
                        CASE WHEN @sort = 'static_value'
                                  AND @desc = 'desc' THEN static_value
                        END DESC ,
                        CASE WHEN @sort = 'static_value'
                                  AND @desc = 'asc' THEN static_value
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT DISTINCT  c.*, ISNULL(v.column_caption, c.column_description) column_caption
        FROM    vd_page_detail_config c
                JOIN @table o ON c.id = o.id
				JOIN  dbo.v_table v
				ON c.column_name= v.column_name AND  c.table_name = v.table_name
      --  ORDER BY o.new_index 
    SELECT m.files_text
	FROM dbo.vd_page_detail  pd
	JOIN dbo.vd_module m ON pd.module_id = m.id
	WHERE pd.id = @page_detail_id 

    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_page_detail_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_list_vd_page_detail_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10),
	@page_id INT
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id  int
 ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_page_detail WITH ( NOLOCK ) 
        WHERE page_id = @page_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    vd_page_detail
        WHERE page_id = @page_id
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'page_id' AND @desc = 'desc' THEN page_id END DESC , CASE WHEN @sort = 'page_id' AND @desc = 'asc' THEN page_id END ASC ,
									CASE WHEN @sort = 'area' AND @desc = 'desc' THEN area END DESC , CASE WHEN @sort = 'area' AND @desc = 'asc' THEN area END ASC ,
									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN table_name END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN table_name END ASC ,
									CASE WHEN @sort = 'module_id' AND @desc = 'desc' THEN module_id END DESC , CASE WHEN @sort = 'module_id' AND @desc = 'asc' THEN module_id END ASC ,
									CASE WHEN @sort = 'comments' AND @desc = 'desc' THEN comments END DESC , CASE WHEN @sort = 'comments' AND @desc = 'asc' THEN comments END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*, t.module_name
        FROM    vd_page_detail c
                JOIN @table o ON c.id = o.id
				LEFT JOIN dbo.vd_module t ON c.module_id = t.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_page_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------


exec [vdp_list_vd_page_pager] 1,20, 1, '',''


*/


alter   PROCEDURE [dbo].[vdp_list_vd_page_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
AS
    BEGIN 
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ); 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_page WITH ( NOLOCK )
       WHERE   parent_id = 0;
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_page
                 WHERE   parent_id = 0
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'desc' THEN template_id
                        END DESC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'asc' THEN template_id
                        END ASC ,
                        CASE WHEN @sort = 'page_name'
                                  AND @desc = 'desc' THEN page_name
                        END DESC ,
                        CASE WHEN @sort = 'page_name'
                                  AND @desc = 'asc' THEN page_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = 'parent_menu_code'
                                  AND @desc = 'desc' THEN parent_menu_code
                        END DESC ,
                        CASE WHEN @sort = 'parent_menu_code'
                                  AND @desc = 'asc' THEN parent_menu_code
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC;  
		
        DELETE  @table
        WHERE   new_index <= @start_index;
         
        SELECT  c.* ,
                t.areas
        FROM    vd_page c
                JOIN @table o ON c.id = o.id
                JOIN dbo.vd_template t ON t.id = c.template_id
        ORDER BY o.new_index; 

		SELECT  c.* 
        FROM    vd_page c
                JOIN @table o ON c.parent_id = o.id 
        ORDER BY o.new_index; 

    
    END; 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_Source_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


 alter   PROCEDURE [dbo].[vdp_list_vd_Source_pager]  @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10) ,
 @page_id int
 AS
    begin
        SELECT  c.*
        FROM    vd_Source c
                
				WHERE @page_id = page_id
				SET @total_row = 10
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_template_module_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_vd_template_module_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10) ,
    @template_id INT
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_module WITH ( NOLOCK ) 
	--WHERE  template_id = @template_id
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT --TOP ( @start_index + @page_size )
                        id
                FROM    vd_module
	--WHERE  template_id = @template_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'desc' THEN template_id
                        END DESC ,
                        CASE WHEN @sort = 'template_id'
                                  AND @desc = 'asc' THEN template_id
                        END ASC ,
                        CASE WHEN @sort = 'module_name'
                                  AND @desc = 'desc' THEN module_name
                        END DESC ,
                        CASE WHEN @sort = 'module_name'
                                  AND @desc = 'asc' THEN module_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'desc' THEN language
                        END DESC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'asc' THEN language
                        END ASC ,
                        CASE WHEN @sort = 'files_text'
                                  AND @desc = 'desc' THEN files_text
                        END DESC ,
                        CASE WHEN @sort = 'files_text'
                                  AND @desc = 'asc' THEN files_text
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        --DELETE  @table
        --WHERE   new_index <= @start_index
         
        SELECT   c.id ,
                c.template_id ,
                c.module_name ,
                c.description ,
                c.files_text ,
               ISNULL(t.id, 0) checked
        FROM    vd_module c
                JOIN @table o ON c.id = o.id
                LEFT	JOIN dbo.vd_template_module t ON t.module_id = c.id
                                                         AND t.template_id = @template_id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_list_vd_template_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_list_vd_template_pager]
    @page_index INT = 0 ,
    @page_size INT = 5 ,
    @total_row INT OUTPUT ,
    @sort VARCHAR(40) ,
    @desc VARCHAR(10)
AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_template WITH ( NOLOCK ) 
        
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_template
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'template_name'
                                  AND @desc = 'desc' THEN template_name
                        END DESC ,
                        CASE WHEN @sort = 'template_name'
                                  AND @desc = 'asc' THEN template_name
                        END ASC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'desc' THEN description
                        END DESC ,
                        CASE WHEN @sort = 'description'
                                  AND @desc = 'asc' THEN description
                        END ASC ,
                        CASE WHEN @sort = 'files'
                                  AND @desc = 'desc' THEN files
                        END DESC ,
                        CASE WHEN @sort = 'files'
                                  AND @desc = 'asc' THEN files
                        END ASC ,
                        CASE WHEN @sort = 'html'
                                  AND @desc = 'desc' THEN html
                        END DESC ,
                        CASE WHEN @sort = 'html'
                                  AND @desc = 'asc' THEN html
                        END ASC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'desc' THEN language
                        END DESC ,
                        CASE WHEN @sort = 'language'
                                  AND @desc = 'asc' THEN language
                        END ASC ,
                        CASE WHEN @sort = 'areas'
                                  AND @desc = 'desc' THEN areas
                        END DESC ,
                        CASE WHEN @sort = 'areas'
                                  AND @desc = 'asc' THEN areas
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_template c
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_loader]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec usp_loader 'ttn','任'

alter  PROC [dbo].[vdp_loader]
    @loader VARCHAR(30) = 'ur' ,
    @value VARCHAR(200) = ''
AS
    BEGIN
        DECLARE @table VARCHAR(100) ,
            @column VARCHAR(150) ,
            @sql VARCHAR(MAX);

        SELECT  @table = [table] ,
                @column = [column]
        FROM    loader
        WHERE   loader = @loader;

        SET @sql = 'SELECT distinct ' + @column + ' text from ' + @table + ' where '
            + @column + ' like ''%' + @value + '%'' ';
        PRINT @sql;
		EXEC(@sql)
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_button_check]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
--EXEC [vdp_vd_menu_button_check]0, 6, 2
alter   PROCEDURE [dbo].[vdp_menu_button_check]
    @id INT--编号
    ,
    @menu_id INT ,
    @role_id INT
AS
    BEGIN 
       IF @id >0
	   begin
        IF EXISTS ( SELECT  1
                    FROM    dbo.vd_Role_Menu_Button
                    WHERE   menu_id = @menu_id
                            AND role_id = @role_id
                            AND button_id = @id )
            DELETE  FROM dbo.vd_Role_Menu_Button
            WHERE   menu_id = @menu_id
                    AND role_id = @role_id
                    AND button_id = @id
        ELSE
            INSERT  INTO [dbo].[vd_Role_Menu_Button]
                    ( [role_id], [menu_id], [button_id] )
            VALUES  ( @role_id, @menu_id, @id )
		END
		ELSE
		BEGIN
		  IF EXISTS ( SELECT  1
                    FROM    dbo.vd_Role_Menu
                    WHERE   menu_id = @menu_id
                            AND role_id = @role_id )
            DELETE  FROM dbo.vd_Role_Menu
            WHERE   menu_id = @menu_id
                    AND role_id = @role_id 
        ELSE
            INSERT  INTO [dbo].vd_Role_Menu
                    ( [role_id], [menu_id]  )
            VALUES  ( @role_id, @menu_id )

		end
    
    END 


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_button_check_all]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

alter   PROCEDURE [dbo].[vdp_menu_button_check_all]
    @flag INT ,
    --@ids VARCHAR(300) ,
    @menu_id INT ,
    @role_id INT
AS
    BEGIN 
        IF @flag = 0
            BEGIN
       
                DELETE  FROM dbo.vd_Role_Menu_Button
                WHERE   menu_id = @menu_id
                        AND role_id = @role_id 
            END
        ELSE
            BEGIN
                INSERT  INTO [dbo].[vd_Role_Menu_Button]
                        ( [role_id] ,
                          [menu_id] ,
                          [button_id]
                        )
                        --SELECT  @role_id ,
                        --        @menu_id ,
                        --        col
                        --FROM    dbo.fn_splitStr(@ids, ',')

                        SELECT  @role_id ,
                                @menu_id ,
                                button_id
                        FROM    dbo.vd_menu_button
                        WHERE   menu_id = @menu_id
                                AND ( button_id NOT IN (
                                      SELECT    button_id
                                      FROM      [dbo].[vd_Role_Menu_Button]
                                      WHERE     role_id = @role_id
                                                AND menu_id = @menu_id ) )
												 

            END
    
    END 


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_button_list_check]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

alter   PROCEDURE [dbo].[vdp_menu_button_list_check]
    @menu_id INT = 0 ,
    @role_id INT = 1
AS
    BEGIN 
        
         
        --SELECT  1 checked ,
        --        c.*
        --FROM    vd_menu_button c WITH ( NOLOCK )  
		
        SELECT  b.icon_class ,
                b.js_event ,
                button_code ,
                mb.button_text ,
                mb.button_sort ,
                b.button_name ,
                ISNULL(rmb.id, 0) checked ,
                b.id
        FROM    dbo.vd_menu_button mb
                JOIN dbo.vd_Button b ON mb.button_id = b.id
                LEFT JOIN vd_Role_Menu_Button rmb ON rmb.role_id = @role_id
                                                   AND rmb.menu_id = @menu_id
                                                   AND rmb.button_id = b.id
        WHERE   mb.menu_id = @menu_id
		UNION

        SELECT  m.icon_class ,
                '' js_event ,
                '' button_code ,
                m.menu_name button_text ,
                0 button_sort ,
                m.menu_name  button_name ,
                ISNULL(rm.id, 0) checked ,
                0 id
        FROM    dbo.vd_Menu m
                LEFT JOIN dbo.vd_Role_Menu rm ON rm.menu_id = m.id AND rm.role_id =@role_id
				WHERE m.id = @menu_id 

    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 菜单管理 
//       描述：删除表menu数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_menu_delete] @id INT--编号
 AS
    BEGIN 
       
       
        DELETE  [vd_Menu]
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 菜单管理 
//       描述：插入数据到表menu
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_menu_insert]
    @menu_code VARCHAR(64)--菜单代码
    ,
    @menu_name VARCHAR(64)--菜单名
    ,
    @parent_id INT--父菜单编号
    ,
    @menu_type INT--菜单类型 0=目录 1=页面 2=其它
    ,
    @button_mode INT--按钮模式 0=动态按钮 1=静态按钮 2=无按钮
    ,
    @url VARCHAR(256)--URL
    ,
    @icon_class VARCHAR(64)--图标类
    ,
    @sort INT--排序
    ,
    @enabled INT--启用 1=启用 0=禁用
    ,
    @remark VARCHAR(128)--备注
    ,
    @add_by INT--创建人
	, @visible_flag INT
    , @menu_token VARCHAR(250)
 AS
    BEGIN 
       
       
	   DECLARE  @m VARCHAR(60)
        IF EXISTS(SELECT 1 FROM [vd_Menu] WHERE [menu_code] = @menu_code)
	   BEGIN
	    
	   SET @m=@menu_code +'已经存在'
	   Raiserror( @m,16,1)    
	   RETURN
       

	   END

        DECLARE @mid INT 
        INSERT  INTO [vd_Menu]
                ( [menu_code] ,
                  [menu_name] ,
                  [parent_id] ,
                  [menu_type] ,
                  [button_mode] ,
                  [url] ,
                  [icon_class] ,
                  [sort] ,
                  [enabled] ,
                  [remark] ,
                  [add_by] ,
                  [add_on],visible_flag,menu_token
                )
        VALUES  ( @menu_code ,
                  @menu_name ,
                  @parent_id ,
                  @menu_type ,
                  @button_mode ,
                  @url ,
                  @icon_class ,
                  @sort ,
                  @enabled ,
                  @remark ,
                  @add_by ,
                  GETDATE(),@visible_flag,@menu_token
                )
        
		
                SET @mid = @@IDENTITY 
		   INSERT  INTO vd_Role_Menu
                        ( role_id, menu_id )
                VALUES  (  1,@mid  );

                INSERT  INTO vd_Role_Menu
                        ( role_id, menu_id )
                VALUES  (  2,@mid  );

    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 菜单管理 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_menu_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Menu WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_Menu WITH ( NOLOCK )
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'desc' THEN menu_code
                        END DESC ,
                        CASE WHEN @sort = 'menu_code'
                                  AND @desc = 'asc' THEN menu_code
                        END ASC ,
                        CASE WHEN @sort = 'menu_name'
                                  AND @desc = 'desc' THEN menu_name
                        END DESC ,
                        CASE WHEN @sort = 'menu_name'
                                  AND @desc = 'asc' THEN menu_name
                        END ASC ,
                        CASE WHEN @sort = 'parent_id'
                                  AND @desc = 'desc' THEN parent_id
                        END DESC ,
                        CASE WHEN @sort = 'parent_id'
                                  AND @desc = 'asc' THEN parent_id
                        END ASC ,
                        CASE WHEN @sort = 'menu_type'
                                  AND @desc = 'desc' THEN menu_type
                        END DESC ,
                        CASE WHEN @sort = 'menu_type'
                                  AND @desc = 'asc' THEN menu_type
                        END ASC ,
                        CASE WHEN @sort = 'button_mode'
                                  AND @desc = 'desc' THEN button_mode
                        END DESC ,
                        CASE WHEN @sort = 'button_mode'
                                  AND @desc = 'asc' THEN button_mode
                        END ASC ,
                        CASE WHEN @sort = 'url'
                                  AND @desc = 'desc' THEN url
                        END DESC ,
                        CASE WHEN @sort = 'url'
                                  AND @desc = 'asc' THEN url
                        END ASC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'desc' THEN icon_class
                        END DESC ,
                        CASE WHEN @sort = 'icon_class'
                                  AND @desc = 'asc' THEN icon_class
                        END ASC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'desc' THEN icon_url
                        END DESC ,
                        CASE WHEN @sort = 'icon_url'
                                  AND @desc = 'asc' THEN icon_url
                        END ASC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'desc' THEN sort
                        END DESC ,
                        CASE WHEN @sort = 'sort'
                                  AND @desc = 'asc' THEN sort
                        END ASC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'desc' THEN enabled
                        END DESC ,
                        CASE WHEN @sort = 'enabled'
                                  AND @desc = 'asc' THEN enabled
                        END ASC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'desc' THEN remark
                        END DESC ,
                        CASE WHEN @sort = 'remark'
                                  AND @desc = 'asc' THEN remark
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Menu c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_tree]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 菜单管理 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_menu_tree] 
 AS
    BEGIN 
      SELECT *
    FROM    vd_Menu c WITH ( NOLOCK )  
	ORDER BY sort;

       --   FROM    Base_Menu c WITH ( NOLOCK )  
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_tree2]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 菜单管理 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_menu_tree2] 
 AS
    BEGIN 
      SELECT c.id id2 ,
             c.menu_code ,
             c.menu_name ,
             c.parent_id ,
             c.menu_type ,
             c.button_mode ,
             c.url ,
             c.icon_class ,
             c.icon_url ,
             c.sort ,
             c.enabled ,
             c.remark ,
             c.add_by ,
             c.add_on ,
             c.visible_flag ,
             c.menu_token
    FROM    vd_Menu c WITH ( NOLOCK )  
	ORDER BY sort;

       --   FROM    Base_Menu c WITH ( NOLOCK )  
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_menu_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 菜单管理 
//       描述：更新表menu数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_menu_update]
    @id INT--编号
    ,
    @menu_code VARCHAR(64)--菜单代码
    ,
    @menu_name VARCHAR(64)--菜单名
    ,
    @parent_id INT--父菜单编号
    ,
    @menu_type INT--菜单类型 0=目录 1=页面 2=其它
    ,
    @button_mode INT--按钮模式 0=动态按钮 1=静态按钮 2=无按钮
    ,
    @url VARCHAR(256)--URL
    ,
    @icon_class VARCHAR(64)--图标类
    ,
    @sort INT--排序
    ,
    @enabled INT--启用 1=启用 0=禁用
    ,
    @remark VARCHAR(128)--备注
    ,
    @add_by INT--创建人
    ,
    @visible_flag INT
	  , @menu_token VARCHAR(250)
AS
    BEGIN 
       		--更新表menu
        UPDATE  [vd_Menu]
        SET     [menu_code] = @menu_code ,
                [menu_name] = @menu_name ,
                [parent_id] = @parent_id ,
                [menu_type] = @menu_type ,
                [button_mode] = @button_mode ,
                [url] = @url ,
                [icon_class] = @icon_class ,
                [sort] = @sort ,
                [enabled] = @enabled ,
                [remark] = @remark ,
                [add_by] = @add_by ,
                visible_flag = @visible_flag,
				menu_token = @menu_token
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_MenuButton_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 按钮设置 
//       描述：删除表MenuButton数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_MenuButton_delete] @id INT--编号
 AS
    BEGIN 
       
       
        DELETE  [vd_menu_button]
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_MenuButton_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮设置 
//       描述：插入数据到表MenuButton
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_MenuButton_insert]
   @add_by INT ,
    @ids VARCHAR(100) ,
    @menu_id INT--菜单编号
   
 AS
    BEGIN 
       
       
        INSERT  INTO [vd_menu_button]
                ( [menu_id] ,
                  [button_id] ,
                  [button_sort] ,
                  [button_text]
                )
        SELECT   
                        @menu_id ,
                        col ,
                        '200', b.button_name
                FROM    dbo.fn_splitStr(@ids, ',') f
				JOIN dbo.vd_Button b ON f.col = b.id
                WHERE   LEN(col) > 0
                        AND col NOT IN ( SELECT [button_id]
                                         FROM   [vd_menu_button]
                                         WHERE  [menu_id] = @menu_id )
        
		INSERT INTO dbo.vd_Role_Menu_Button
		        ( role_id, menu_id, button_id )
		select 1, -- role_id - int
		          @menu_id, -- menu_id - int
		         col
                FROM    dbo.fn_splitStr(@ids, ',')

					INSERT INTO dbo.vd_Role_Menu_Button
		        ( role_id, menu_id, button_id )
		select 2, -- role_id - int
		          @menu_id, -- menu_id - int
		         col
                FROM    dbo.fn_splitStr(@ids, ',')
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_MenuButton_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮设置 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_MenuButton_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
	,@MemuID int
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_menu_button WITH ( NOLOCK ) 
        	  WHERE menu_id = @MemuID     
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_menu_button WITH ( NOLOCK )
        	  WHERE menu_id = @MemuID     
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'menu_id'
                                  AND @desc = 'desc' THEN menu_id
                        END DESC ,
                        CASE WHEN @sort = 'menu_id'
                                  AND @desc = 'asc' THEN menu_id
                        END ASC ,
                        CASE WHEN @sort = 'button_id'
                                  AND @desc = 'desc' THEN button_id
                        END DESC ,
                        CASE WHEN @sort = 'button_id'
                                  AND @desc = 'asc' THEN button_id
                        END ASC ,
                        CASE WHEN @sort = 'button_sort'
                                  AND @desc = 'desc' THEN button_sort
                        END DESC ,
                        CASE WHEN @sort = 'button_sort'
                                  AND @desc = 'asc' THEN button_sort
                        END ASC ,
                        CASE WHEN @sort = 'button_text'
                                  AND @desc = 'desc' THEN button_text
                        END DESC ,
                        CASE WHEN @sort = 'button_text'
                                  AND @desc = 'asc' THEN button_text
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*, b.button_name, b.icon_class
        FROM    vd_menu_button c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
				JOIN dbo.vd_Button b
				ON b.id = c.button_id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_MenuButton_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 按钮设置 
//       描述：更新表MenuButton数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_MenuButton_update]
    @id INT--编号
    ,
    @menu_id INT--菜单编号
    ,
    @button_id INT--按钮编号
    ,
    @button_sort INT--排序
    ,
    @button_text VARCHAR(32)--按钮文字
 AS
    BEGIN 
       		--更新表MenuButton
        UPDATE  [vd_menu_button]
        SET     [menu_id] = @menu_id ,
                [button_id] = @button_id ,
                [button_sort] = @button_sort ,
                [button_text] = @button_text
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_module_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_module_list]
AS
    BEGIN
        SELECT    id ,
             [module_name]     [text]
        FROM     [dbo].[vd_module]
        
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_my_user_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf  
//			  
//       描述：删除表my_user数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_my_user_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [test_user]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_my_user_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			  
//       描述：插入数据到表my_user
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_my_user_insert] 
 @add_by int--创建人
,@user_name nvarchar(100)--用户名
,@password nvarchar(300)--口令
,@email nvarchar(300)--email
,@name nvarchar(30)--姓名
,@department_id int--部门编号
 
 
 AS
    BEGIN 
       
       
          Insert into  [test_user]
          (
           [add_on]
,[add_by]
,[user_name]
,[password]
,[email]
,[name]
,[department_id]
          )
        values(   
         getdate()
,@add_by
,@user_name
,@password
,@email
,@name
,@department_id
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_my_user_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_my_user_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@department_id int--部门编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [test_user] WITH ( NOLOCK ) 
        	 where   @department_id=department_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [test_user] WITH ( NOLOCK ) 
                	 where   @department_id=department_id
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'user_name' AND @desc = 'desc' THEN [user_name] END DESC , CASE WHEN @sort = 'user_name' AND @desc = 'asc' THEN [user_name] END ASC ,
									CASE WHEN @sort = 'password' AND @desc = 'desc' THEN [password] END DESC , CASE WHEN @sort = 'password' AND @desc = 'asc' THEN [password] END ASC ,
									CASE WHEN @sort = 'email' AND @desc = 'desc' THEN [email] END DESC , CASE WHEN @sort = 'email' AND @desc = 'asc' THEN [email] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'department_id' AND @desc = 'desc' THEN [department_id] END DESC , CASE WHEN @sort = 'department_id' AND @desc = 'asc' THEN [department_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [test_user] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_my_user_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf  
//			  
//       描述：更新表my_user数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_my_user_update] 
 @id int--
,@user_name nvarchar(100)--用户名
,@password nvarchar(300)--口令
,@email nvarchar(300)--email
,@name nvarchar(30)--姓名
,@department_id int--部门编号
 
 
 AS
    BEGIN 
       		--更新表my_user
          UPDATE  [test_user]
        SET   
         [user_name] =  @user_name
,[password] =  @password
,[email] =  @email
,[name] =  @name
,[department_id] =  @department_id
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_myuser_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷  
//			 测试使用 
//       描述：删除表myuser数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_myuser_delete] 
 @id int--
 
 
 AS
    BEGIN 
       
       
          Delete  [test_user]
        
        WHERE   [id] =0-- @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_myuser_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷   
//			 测试使用 
//       描述：插入数据到表myuser
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_myuser_insert] 
 @add_on datetime--创建日期
,@add_by int--创建人
,@user_name nvarchar(100)--用户名
,@name nvarchar(30)--姓名
,@department_id int--部门编号
,@password nvarchar(300)--
,@email nvarchar(300)--
 
 
 AS
    BEGIN 
       
       
          Insert into  [test_user]
          (
           [add_on]
,[add_by]
,[user_name]
,[name]
,[department_id]
,[password]
,[email]
          )
        values(   
         @add_on
,@add_by
,@user_name
,@name
,@department_id
,@password
,@email
      )
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_myuser_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-16
//       作者： 蔡捷   
//			 测试使用 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_myuser_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    ,
    @department_id INT--部门编号
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--
            ) 
	
        SELECT  @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK )
        WHERE   @department_id = department_id
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    test_user WITH ( NOLOCK )
                WHERE   @department_id = department_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'user_name'
                                  AND @desc = 'desc' THEN user_name
                        END DESC ,
                        CASE WHEN @sort = 'user_name'
                                  AND @desc = 'asc' THEN user_name
                        END ASC ,
                        CASE WHEN @sort = 'name'
                                  AND @desc = 'desc' THEN name
                        END DESC ,
                        CASE WHEN @sort = 'name'
                                  AND @desc = 'asc' THEN name
                        END ASC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'desc' THEN department_id
                        END DESC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'asc' THEN department_id
                        END ASC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'desc' THEN password
                        END DESC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'asc' THEN password
                        END ASC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'desc' THEN email
                        END DESC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'asc' THEN email
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    test_user c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_myuser_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-17
//       作者： 蔡捷  
//			 测试使用 
//       描述：更新表myuser数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_myuser_update] 
 @id int--
,@add_on datetime--创建日期
,@add_by int--创建人
,@user_name nvarchar(100)--用户名
,@name nvarchar(30)--姓名
,@department_id int--部门编号
,@password nvarchar(300)--
,@email nvarchar(300)--
 
 
 AS
    BEGIN 
       		--更新表myuser
          UPDATE  [test_user]
        SET   
         [add_on] =  @add_on
,[add_by] =  @add_by
,[user_name] =  @user_name
,[name] =  @name
,[department_id] =  @department_id
,[password] =  @password
,[email] =  @email
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_reset_password]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷  
//			 用户 
//       描述：更新表vd_User数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_reset_password] 
 @add_by INT,--编号,
 @pwd VARCHAR(150)
 
 
 AS
    BEGIN 
       		--更新表vd_User
          UPDATE  [vd_User]
        SET   
         [password] =  @pwd 
        WHERE   [id] = @add_by 
        
    
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_reset_pwd]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter  PROC [dbo].[vdp_reset_pwd]
    @user_code VARCHAR(64) ,
    @password VARCHAR(128) 
AS
    BEGIN
  
        update    [vd_User]
		SET  [password] = @password
        WHERE   user_code= @user_code  
    END




GO
/****** Object:  StoredProcedure [dbo].[vdp_role_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 角色管理 
//       描述：删除表role数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_role_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_Role]
        
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_role_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 alter   PROCEDURE [dbo].[vdp_role_insert]
    @role_code VARCHAR(64)--角色代码
    ,
    @role_name VARCHAR(64)--角色名
    ,
    @role_type INT--角色类型 0=未定义 1=系统角色 2=业务角色 3=其他
    ,
    @sort INT--排序
    ,
    @enabled INT--启用 0=禁用 1=启用
    ,
    @remark VARCHAR(128)--备注
    ,
    @add_by INT
 AS
    BEGIN 
       
       
        INSERT  INTO [vd_Role]
                ( [role_code] ,
                  [role_name] ,
                  [role_type] ,
                  [sort] ,
                  [enabled] ,
                  [remark] ,
                  [add_by] ,
                  [add_on]
                )
        VALUES  ( @role_code ,
                  @role_name ,
                  @role_type ,
                  @sort ,
                  @enabled ,
                  @remark ,
                  @add_by ,
                  GETDATE()
                )

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_Role_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROCEDURE [dbo].[vdp_Role_list]
AS
    BEGIN 
        SELECT  c.*
        FROM    vd_Role c WITH ( NOLOCK ) 
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_role_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 角色管理 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_role_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--编号
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_Role WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    vd_Role WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN id END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN id END ASC ,
									CASE WHEN @sort = 'role_code' AND @desc = 'desc' THEN role_code END DESC , CASE WHEN @sort = 'role_code' AND @desc = 'asc' THEN role_code END ASC ,
									CASE WHEN @sort = 'role_name' AND @desc = 'desc' THEN role_name END DESC , CASE WHEN @sort = 'role_name' AND @desc = 'asc' THEN role_name END ASC ,
									CASE WHEN @sort = 'role_type' AND @desc = 'desc' THEN role_type END DESC , CASE WHEN @sort = 'role_type' AND @desc = 'asc' THEN role_type END ASC ,
									CASE WHEN @sort = 'sort' AND @desc = 'desc' THEN sort END DESC , CASE WHEN @sort = 'sort' AND @desc = 'asc' THEN sort END ASC ,
									CASE WHEN @sort = 'enabled' AND @desc = 'desc' THEN enabled END DESC , CASE WHEN @sort = 'enabled' AND @desc = 'asc' THEN enabled END ASC ,
									CASE WHEN @sort = 'remark' AND @desc = 'desc' THEN remark END DESC , CASE WHEN @sort = 'remark' AND @desc = 'asc' THEN remark END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN add_by END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN add_by END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN add_on END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN add_on END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    vd_Role c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_role_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO







/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷  
//			 角色管理 
//       描述：更新表role数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_role_update] 
 @id int--编号
,@role_code varchar(64)--角色代码
,@role_name varchar(64)--角色名
,@role_type int--角色类型 0=未定义 1=系统角色 2=业务角色 3=其他
,@sort int--排序
,@enabled int--启用 0=禁用 1=启用
,@remark varchar(128)--备注
 
 
 AS
    BEGIN 
       		--更新表role
          UPDATE  [vd_Role]
        SET   
         [role_code] =  @role_code
,[role_name] =  @role_name
,[role_type] =  @role_type
,[sort] =  @sort
,[enabled] =  @enabled
,[remark] =  @remark
        WHERE   [id] = @id 
        
    
    END 
    




    


GO
/****** Object:  StoredProcedure [dbo].[vdp_syn_detail_config]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
exec usp_syn_detail_config 24,
'<row><cn>id</cn><t>int</t><l>10</l></row><row><cn>add_on</cn><t>datetime</t><l>23</l></row><row><cn>add_by</cn><t>int</t><l>10</l></row><row><cn>user_name</cn><t>nvarchar</t><l>50</l></row><row><cn>password</cn><t>nvarchar</t><l>150</l></row><row><cn>email</cn><t>nvarchar</t><l>150</l></row><row><cn>name</cn><t>nvarchar</t><l>15</l></row><row><cn>department_id</cn><t>int</t><l>10</l></row>'
,'test_user2'

select * from 
delete vd_page_detail_config
where page_detail_id=24

*/

alter  PROC [dbo].[vdp_syn_detail_config]
    @page_detail_id INT ,
 --   @x VARCHAR(MAX) ,
    @table_name VARCHAR(200)
AS
    BEGIN


	 

		 
        DECLARE @t TABLE
            (
              column_name VARCHAR(50) ,
              column_description NVARCHAR(150) ,
              column_caption NVARCHAR(150) ,
              [type] NVARCHAR(20) ,
              [length] INT,
			  isPrimary INT
            );

	
    --    INSERT  INTO @t
    --        SELECT  column_name cn , -- column_name - varchar(50)
    --            column_description cd , -- column_description - nvarchar(150)
			 --	column_caption c,
    --            type  t, -- column_type - nvarchar(20)
    --            length l -- column_length - int  
				--,CASE WHEN flag_identity = '√'
    --                 OR flag_primary = '√' THEN 1 ELSE 0 END p
    --    FROM    restaurant_app.dbo.v_table --需要根据实际应用数据库改变
    --    WHERE   table_name = @table_name

    --    INSERT  INTO dbo.vd_page_detail_config
    --            ( page_detail_id ,
    --              is_show ,
    --              is_where ,
    --              is_insert ,
    --              is_update ,
    --              width ,
    --              data ,
    --              valid ,
    --              is_required ,
    --              column_name ,
    --              column_description ,
    --              column_type ,
    --              column_length ,
    --              html_type ,
    --              static_value ,
    --              table_name,column_caption, isPrimary
			 --   )
    --            SELECT  @page_detail_id , -- page_detail_id - int
    --                    1 , -- is_show - int
    --                    0 , -- is_where - int
    --                    1 , -- is_insert - int
    --                    1 , -- is_update - int
    --                    0 , -- width - int
    --                    N'' , -- data - nvarchar(250)
    --                    N'' , -- valid - nvarchar(250)
    --                    0 , -- is_required - int
    --                    column_name , -- column_name - varchar(50)
    --                    column_description , -- column_description - nvarchar(150)
    --                    [type] , -- column_type - nvarchar(20)
    --                    [length] , -- column_length - int
    --                    'textbox' , -- html_type - varchar(20)
    --                    N''  -- static_value - nvarchar(50)
    --                    ,
    --                    @table_name,
				--		column_caption,isPrimary
    --            FROM    @t
    --            WHERE   column_name NOT IN (
    --                    SELECT  column_name
    --                    FROM    vd_page_detail_config
    --                    WHERE   table_name = @table_name
    --                            AND @page_detail_id = page_detail_id ); 

    --    DELETE  dbo.vd_page_detail_config
    --    WHERE   page_detail_id = @page_detail_id
    --            AND column_name NOT IN ( SELECT  column_name
    --                                    FROM    @t );

		

      --  DECLARE @xml AS XML;
      --  SET @x = REPLACE(@x, '&gt;', '>');
      --  SET @x = REPLACE(@x, '&lt;', '<');

      --  SET @xml = CAST(@x AS XML);

		 
        --DECLARE @t TABLE
        --    (
        --      column_name VARCHAR(50) ,
        --      column_description NVARCHAR(150) ,
        --      column_caption NVARCHAR(150) ,
        --      [type] NVARCHAR(20) ,
        --      [length] INT
        --    );


      --  INSERT  INTO @t
      --          SELECT  v.value('cn[1]', 'varchar(50)') AS cn ,
      --                  v.value('cd[1]', 'varchar(150)') AS cd ,
      --                  v.value('c[1]', 'varchar(200)') AS c ,
      --                  v.value('t[1]', 'varchar(20)') AS t ,
      --                  v.value('l[1]', 'int') AS l
      --          FROM    @xml.nodes('/row') XML ( v );

      --  INSERT  INTO dbo.vd_page_detail_config
      --          ( page_detail_id ,
      --            is_show ,
      --            is_where ,
      --            is_insert ,
      --            is_update ,
      --            width ,
      --            data ,
      --            valid ,
      --            is_required ,
      --            column_name ,
      --            column_description ,
      --            column_type ,
      --            column_length ,
      --            html_type ,
      --            static_value ,
      --            table_name,column_caption
			   -- )
      --          SELECT  @page_detail_id , -- page_detail_id - int
      --                  1 , -- is_show - int
      --                  0 , -- is_where - int
      --                  1 , -- is_insert - int
      --                  1 , -- is_update - int
      --                  0 , -- width - int
      --                  N'' , -- data - nvarchar(250)
      --                  N'' , -- valid - nvarchar(250)
      --                  0 , -- is_required - int
      --                  column_name , -- column_name - varchar(50)
      --                  column_description , -- column_description - nvarchar(150)
      --                  [type] , -- column_type - nvarchar(20)
      --                  [length] , -- column_length - int
      --                  'textbox' , -- html_type - varchar(20)
      --                  N''  -- static_value - nvarchar(50)
      --                  ,
      --                  @table_name,
						--column_caption
      --          FROM    @t
      --          WHERE   column_name NOT IN (
      --                  SELECT  column_name
      --                  FROM    vd_page_detail_config
      --                  WHERE   table_name = @table_name
      --                          AND @page_detail_id = page_detail_id ); 

      --  DELETE  dbo.vd_page_detail_config
      --  WHERE   page_detail_id = @page_detail_id
      --          AND column_name NOT IN ( SELECT  column_name
      --                                  FROM    @t );



    END; 

GO
/****** Object:  StoredProcedure [dbo].[vdp_synchronize]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter   PROC [dbo].[vdp_synchronize]
    @language VARCHAR(20) = 'mssql.net' ,
    @Framework VARCHAR(20) = 'easyui'
AS
    BEGIN


        SELECT   id ,
                template_name ,
                description ,
                files ,
                html ,
                areas ,
                edit_flag-- ,
               -- language ,
               -- js_framwork
        FROM    dbo.vd_template
        WHERE   [language] = @language
                AND js_framwork = @Framework

        SELECT   id ,
                template_id ,
                module_name ,
                description ,
                files_text ,
                edit_flag-- ,
               -- language ,
               -- js_framwork
        FROM    dbo.vd_module
        WHERE   [language] = @language
                AND js_framwork = @Framework

    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_synchronize_vd_module]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_synchronize_vd_module]
    (
      @id INT ,
      @template_id INT ,
      @module_name VARCHAR(50) ,
      @description VARCHAR(500) ,
      @files_text VARCHAR(1000) ,
      @edit_flag INT ,
      @language VARCHAR(50) ,
      @JSFramework VARCHAR(50) ,
      @clean_table_flag INT
    )
AS
    BEGIN
	
--	set IDENTITY_INSERT vd_module off
--set IDENTITY_INSERT dbo.vd_template off
       
        IF ( @clean_table_flag = 0 )
            BEGIN
       
                TRUNCATE TABLE vd_module;
            END;
       
        INSERT  INTO vd_module
                ( id ,
                  template_id ,
                  module_name ,
                  description ,
                  files_text ,
                  edit_flag ,
                  language ,
                  js_framwork
                )
        VALUES  ( @id ,
                  @template_id ,
                  @module_name ,
                  @description ,
                  @files_text ,
                  @edit_flag ,
                  @language ,
                  @JSFramework
                ); 
    END;
  

GO
/****** Object:  StoredProcedure [dbo].[vdp_synchronize_vd_template]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_synchronize_vd_template]
    (
      @template_name VARCHAR(50) ,
      @description VARCHAR(500) ,
      @files VARCHAR(300) ,
      @html VARCHAR(2000) ,
      @areas VARCHAR(150) ,
      @language VARCHAR(50) ,
      @JSFramework VARCHAR(50) ,
      @id INT ,
      @clean_table_flag INT
    )
AS
    BEGIN
	     
        IF ( @clean_table_flag = 0 )
            TRUNCATE TABLE vd_template; 
    
        INSERT  INTO vd_template
                ( id ,
                  template_name ,
                  description ,
                  files ,
                  html ,
                  areas ,
                  language ,
                  js_framwork
                )
        VALUES  ( @id ,
                  @template_name ,
                  @description ,
                  @files ,
                  @html ,
                  @areas ,
                  @language ,
                  @JSFramework
                );   
        
    
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_sys_get_code_structure]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*

SELECT TOP 10 * FROM dbo.vd_page ORDER BY id desc
*/
alter  PROC [dbo].[vdp_sys_get_code_structure]
@page_id INT =9
AS
    BEGIN

        SELECT  m.id mid ,
                m.parent_id ,
                m.menu_code ,
                m.menu_name ,
                p.description ,
                p.id pid
        FROM    dbo.vd_page p
                JOIN dbo.vd_Menu m ON p.page_name = m.menu_code
				WHERE p.id = @page_id

		SELECT p.id pid, pd.id pdid,  t.template_name, p.page_name, pd.*, m.module_name FROM vd_page p
		join dbo.vd_page_detail pd ON pd.page_id = p.id
		JOIN dbo.vd_module m ON m.id = pd.module_id
		JOIN dbo.vd_template t ON t.id = p.template_id
		WHERE p.id = @page_id
		 
		 SELECT a.* FROM dbo.vd_Action a
		 JOIN dbo.vd_page p ON p.page_name = a.menu_code
		 WHERE p.id = @page_id



    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_sys_Login]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 /*
 exec [vdp_sys_Login] 'sysadmin','202cb962ac59075b964b07152d234b70','127.0.0.1','tj'
 
 */
alter  PROC [dbo].[vdp_sys_Login]
    @user_code VARCHAR(64) ,
    @password VARCHAR(128) ,
    @LoginIP VARCHAR(64) ,
    @LoginCity VARCHAR(64)
AS
    BEGIN
 
        SET nocount ON
        BEGIN TRANSACTION vd_User_Login
        BEGIN TRY 
            DECLARE @ResultID INT
            DECLARE @ResultMsg VARCHAR(1024)
            SET @ResultID = 0
            SET @ResultMsg = '登录成功'
	
            IF ( @user_code = '' )
                BEGIN
                    RAISERROR('账号不能为空，请确认！',16,1)
                END
	
            IF ( @password = '' )
                BEGIN
                    RAISERROR('密码不能为空，请确认！',16,1)
                END
	
            IF NOT EXISTS ( SELECT  *
                            FROM    [dbo].[vd_User]
                            WHERE   [user_code] = @user_code )
                BEGIN
                    RAISERROR('账号不存在！',16,1)
                END

            IF NOT EXISTS ( SELECT  *
                            FROM    [dbo].[vd_User]
                            WHERE   [user_code] = @user_code
                                    AND [password] = @password )
                BEGIN
                    RAISERROR('密码有误！',16,1)
                END

        --    IF EXISTS ( SELECT  *
        --                FROM    [dbo].[vd_User]
        --                WHERE   [user_code] = @user_code
        --                        AND [password] = @password
        --                        --AND [IsAudit] = 0 
								--)
        --        BEGIN
        --            RAISERROR('账号未审核！',16,1)
        --        END

            --IF EXISTS ( SELECT  *
            --            FROM    [dbo].[vd_User]
            --            WHERE   [user_code] = @user_code
            --                    AND [password] = @password
            --                      )
            --    BEGIN
            --        RAISERROR('账号已禁用！',16,1)
            --    END

	--更新登录信息
            --UPDATE  [dbo].[vd_User]
            --SET     [LoginCount] = ISNULL([LoginCount], 0) + 1 ,
            --        [LoginTime] = GETDATE() ,
            --        [LoginIP] = @LoginIP ,
            --        [LoginCity] = @LoginCity
            --WHERE   [user_code] = @user_code
---------------------------------------------------------------------------
        END TRY
        BEGIN CATCH
            SET @ResultID = @@error
            SET @ResultMsg = ERROR_MESSAGE()
            ROLLBACK TRANSACTION vd_User_Login
        END CATCH
	
        IF ( @ResultID = 0 )
            BEGIN
                COMMIT TRANSACTION  vd_User_Login
            END
	
	--表0[结果表]
        SELECT  @ResultID AS ResultID ,
                @ResultMsg AS ResultMsg --返回结果

        SELECT  *, dbo.uf_get_role_ids(id) role_ids
        FROM    [dbo].[vd_User]
        WHERE   [user_code] = @user_code AND (@ResultID =0)
    END




GO
/****** Object:  StoredProcedure [dbo].[vdp_sys_page_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*

SELECT TOP 10 * FROM dbo.vd_page ORDER BY id desc
*/
alter   PROC [dbo].[vdp_sys_page_list] 
AS
    BEGIN

        SELECT  m.id mid ,
                m.parent_id ,
                m.menu_code ,
                m.menu_name ,
                p.description ,
                p.id pid
        FROM    dbo.vd_page p
                JOIN dbo.vd_Menu m ON p.page_name = m.menu_code 
 
    END;

GO
/****** Object:  StoredProcedure [dbo].[vdp_table_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter   PROC [dbo].[vdp_table_list]
AS
    BEGIN
        SELECT  name id ,
                name [text]
        FROM    sysobjects
        WHERE   ([type] = 'U' OR [type]='V')                AND name NOT LIKE 'Base_%'
              --  AND name NOT LIKE 'vd_%'
        ORDER BY name
    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_table_list_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_table_list_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	 AS
    BEGIN 
--        DECLARE @start_index INT 
--        --EasyUI 页序号从1开始，这里减一以修正
--				set @page_index = @page_index -1
--        SET @start_index = @page_size * @page_index
--        DECLARE @table TABLE
--            (
--              new_index INT IDENTITY(1, 1) NOT NULL ,
--id int--编号
--) 
	
--        SELECT  @total_row = COUNT(*)
--        FROM    table_admin WITH ( NOLOCK ) 
        	       
--        INSERT  INTO @table
--                ( id
--		        )
--                SELECT TOP ( @start_index + @page_size )
--                       id 
--                FROM    table_admin WITH ( NOLOCK ) 
                	         
--                ORDER BY 
--                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
--									CASE WHEN @sort = 'table_name' AND @desc = 'desc' THEN [table_name] END DESC , CASE WHEN @sort = 'table_name' AND @desc = 'asc' THEN [table_name] END ASC ,
--									CASE WHEN @sort = 'description' AND @desc = 'desc' THEN [description] END DESC , CASE WHEN @sort = 'description' AND @desc = 'asc' THEN [description] END ASC ,
            
--                        CASE WHEN @sort = ' '  THEN id
--                        END desc  
		
--        DELETE  @table
--        WHERE   new_index <= @start_index
         
--        --SELECT  c.*
--        --FROM    table_admin c WITH ( NOLOCK ) 
--        --        JOIN @table o ON c.id = o.id
--        --ORDER BY o.new_index 


		SET @total_row = 10
          SELECT  DISTINCT  
                 v.table_name   table_name
				 ,v.table_description description
        FROM  dbo.v_table v  
    
    END 
    



GO
/****** Object:  StoredProcedure [dbo].[vdp_table_list_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 



/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2  
//			  
//       描述：更新表table_list数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_table_list_update] 
 @table_name varchar(30)--表名
,@description varchar(200)--描述
 
 
 AS
    BEGIN 

	DECLARE @amount INT;
	  SELECT  @amount = COUNT([value])     FROM ::fn_listextendedproperty('MS_description', 'user', 'dbo', 'table',  @table_name, NULL, NULL)  
	  IF @amount >0
	  EXECUTE sp_updateextendedproperty  N'MS_description',@description,N'user',N'dbo',N'table',@table_name  ,NULL,NULL ;
	  else
	  EXECUTE  sp_addextendedproperty   N'MS_description',@description,N'user',N'dbo',N'table',@table_name  ,NULL,NULL ;

--            int desc_count = db.Sql(sql_desc_count).QuerySingle<int>();
--            string spnam = desc_count == 0 ? "sp_addextendedproperty" : "sp_updateextendedproperty";

--            string sql = "EXECUTE " + spnam + " N'MS_description',N'" + tabledescription + "',N'user',N'dbo',N'table',N'" + tableName + "',NULL,NULL";
--            db.Sql(sql).Execute();
--       		--更新表table_list
--          UPDATE  [table_admin]
--        SET   
--         [table_name] =  @table_name
--,[description] =  @description
--        WHERE   [id] = @id 
        
    
    END 
    





GO
/****** Object:  StoredProcedure [dbo].[vdp_template_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04 
//       作者： 蔡捷     
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_template_list] 
 AS
    BEGIN  
	SELECT  id, template_name text, REPLACE(REPLACE(description,'&lt;', '<'),'&gt;', '>') [desc]
        FROM    vd_template   
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_test_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


alter   PROCEDURE [dbo].[vdp_test_list]
AS
    BEGIN 
        SELECT DISTINCT TOP 10 
                [add_by] ,
                [add_on] ,
                [department_id] ,
                [department_id] value ,
                [email] ,
             --   [id] ,
                [name] ,
                [password] ,
                [user_name]
        FROM    [test_user];
        
    	       
        
    
    END; 
    





    


GO
/****** Object:  StoredProcedure [dbo].[vdp_test_list2]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


alter   PROCEDURE [dbo].[vdp_test_list2]
AS
    BEGIN 
        SELECT DISTINCT TOP 10 
                [add_by] ,
                [add_on]  ,
                [department_id] ,
                [department_id]  ,
                [email] xAxis,
             --   [id] ,
                [name] ,
                [password] data,
                [user_name]
        FROM    [test_user]
		WHERE [department_id]=1
		ORDER BY name, xAxis
        
    	       
        
    
    END; 
    





    


GO
/****** Object:  StoredProcedure [dbo].[vdp_test_user_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-10
//       作者： 谢军   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_test_user_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10), --排序方向asc or desc,
    @xml varchar(max)
    	,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
 AS
    BEGIN 
    	
    	
    	if(@xml  ='')
    	set @xml  = '<root></root>'
    	
    	  SET @total_row = 10;
        SET @xml = REPLACE(@xml, '&amp;gt', '>');
        SET @xml = REPLACE(@xml, '&amp;lt', '<');
        DECLARE @x XML;
        DECLARE @value VARCHAR(30) ,
            @column_name VARCHAR(30) ,
            @compare VARCHAR(20) ,
             @orand VARCHAR(20) ,
            @sql NVARCHAR(max) ,
            @sql2 NVARCHAR(max) , 
            @sql_where NVARCHAR(max) , 
            @sql_order NVARCHAR(max)
            

        SET @x = CAST(@xml AS XML); 
 
        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  v.value('@value[1]', 'varchar(20)') AS value , 
            v.value('@orand[1]', 'varchar(20)') AS orand ,
                    v.value('@column_name[1]', 'varchar(30)') AS column_name ,
                    v.value('@compare[1]', 'varchar(20)') AS compare
            FROM    @x.nodes('/root/item') XML ( v )
            ORDER BY column_name;

        OPEN  cursor_pair;  

        SET @sql = '';


        
        FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name, @compare;  
        WHILE @@FETCH_STATUS = 0
            BEGIN 
  				
                SET @compare = REPLACE(@compare, 'gt', '>');
                SET @compare = REPLACE(@compare, 'lt', '<'); 
                if(@sql ='')
                        SET @sql = @sql + ' '+  @column_name+' '  + @compare + ' ''' + @value +'''' ; 
                        else 
                        SET @sql = @sql +' '+ @orand+ ' '+ @column_name   + @compare + ' ''' + @value  +''''; 
                FETCH NEXT FROM cursor_pair  INTO @value, @orand,  @column_name, @compare;  
            END;  
            
            if(@sql <>'')
            set @sql ='('+ @sql+')'

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

    --    PRINT @sql;
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;

        IF EXISTS ( ( SELECT    *
                      FROM      tempdb..sysobjects
                      WHERE     id = OBJECT_ID('tempdb..#Tbtest_user')
                    ) )
            DROP TABLE [dbo].[#Tbtest_user];


        create  TABLE [dbo].[#Tbtest_user]
            (
              id2 INT IDENTITY ,
             -- department_name NVARCHAR(30) DEFAULT ( '' ) ,
              id INT DEFAULT ( 100 )
            ); 
    	
    	
    	 set @sql_where=' ( @user_name=user_name or @user_name='''' )
 and  ( @email=email or @email='''' )
 and  ( @name=name or @name='''' )
'
         set @sql_order ='
                ORDER BY 
                									CASE WHEN @sort = ''id''   AND @desc = ''desc'' THEN id END DESC ,   CASE WHEN @sort = ''id'' AND @desc = ''asc'' THEN id END ASC ,
									CASE WHEN @sort = ''add_on''   AND @desc = ''desc'' THEN add_on END DESC ,   CASE WHEN @sort = ''add_on'' AND @desc = ''asc'' THEN add_on END ASC ,
									CASE WHEN @sort = ''add_by''   AND @desc = ''desc'' THEN add_by END DESC ,   CASE WHEN @sort = ''add_by'' AND @desc = ''asc'' THEN add_by END ASC ,
									CASE WHEN @sort = ''user_name''   AND @desc = ''desc'' THEN user_name END DESC ,   CASE WHEN @sort = ''user_name'' AND @desc = ''asc'' THEN user_name END ASC ,
									CASE WHEN @sort = ''password''   AND @desc = ''desc'' THEN password END DESC ,   CASE WHEN @sort = ''password'' AND @desc = ''asc'' THEN password END ASC ,
									CASE WHEN @sort = ''email''   AND @desc = ''desc'' THEN email END DESC ,   CASE WHEN @sort = ''email'' AND @desc = ''asc'' THEN email END ASC ,
									CASE WHEN @sort = ''name''   AND @desc = ''desc'' THEN name END DESC ,   CASE WHEN @sort = ''name'' AND @desc = ''asc'' THEN name END ASC ,
									CASE WHEN @sort = ''department_id''   AND @desc = ''desc'' THEN department_id END DESC ,   CASE WHEN @sort = ''department_id'' AND @desc = ''asc'' THEN department_id END ASC ,
            
                        CASE WHEN @sort = ''''  THEN id
                        END desc  '
		
     
     
       if(@sql <>'' and @sql_where <>'')
                   SET @sql_where= @sql + ' and ' + @sql_where;
    IF(@sql_where <>'')
			SET @sql_where =' where '+@sql_where
			 SET @sql2 = 'SELECT @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK ) '  +@sql_where
        
        
        
         EXEC sp_executesql @sql2, N'
          @total_row int output ,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
',  @total_row OUTPUT,@user_name
,@email
,@name
;   
        PRINT @total_row;
        
        
        
        SET @sql2 = '        INSERT  INTO [#Tbtest_user]
               ( id
		        )
               SELECT TOP ( @start_index + @page_size )   id 
               
      FROM    test_user WITH ( NOLOCK ) '  +@sql_where+@sql_order
      
      
      
         EXEC sp_executesql @sql2, N'
          @start_index int, @page_size int, @desc varchar(20), @sort varchar(20) ,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
', @start_index  , @page_size  , @desc  , @sort  ,@user_name
,@email
,@name
;   
             	
       DELETE  #Tbtest_user
        WHERE   id2 <= @start_index;

        SELECT  t.*  
        FROM    test_user t
                JOIN [#Tbtest_user] o ON t.id = o.id
        ORDER BY o.id2; 
        
    END 
    


 


    


GO
/****** Object:  StoredProcedure [dbo].[vdp_test_user_query]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-11
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_test_user_query]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10), --排序方向asc or desc,
    @xml varchar(max)
    	,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
 AS
    BEGIN 
    	
    	
    	if(@xml  ='')
    	set @xml  = '<root></root>'
    	
    	  SET @total_row = 10;
        SET @xml = REPLACE(@xml, '&gt', '>');
        SET @xml = REPLACE(@xml, '&lt', '<');
        DECLARE @x XML;
        DECLARE @value VARCHAR(30) ,
            @column_name VARCHAR(30) ,
            @compare VARCHAR(20) ,
             @orand VARCHAR(20) ,
            @sql NVARCHAR(max) ,
            @sql2 NVARCHAR(max) , 
            @sql_where NVARCHAR(max) , 
            @sql_order NVARCHAR(max)
            

        SET @x = CAST(@xml AS XML); 
 
        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  v.value('@value[1]', 'varchar(20)') AS value , 
            v.value('@orand[1]', 'varchar(20)') AS orand ,
                    v.value('@column_name[1]', 'varchar(30)') AS column_name ,
                    v.value('@compare[1]', 'varchar(20)') AS compare
            FROM    @x.nodes('/root/item') XML ( v )
            ORDER BY column_name;

        OPEN  cursor_pair;  

        SET @sql = '';


        
        FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name, @compare;  
        WHILE @@FETCH_STATUS = 0
            BEGIN 
  				
                SET @compare = REPLACE(@compare, 'gt', '>');
                SET @compare = REPLACE(@compare, 'lt', '<'); 
                if(@sql ='')
                        SET @sql = @sql + ' '+  @column_name+' '  + @compare + ' ''' + @value +'''' ; 
                        else 
                        SET @sql = @sql +' '+ @orand+ ' '+ @column_name   + @compare + ' ''' + @value  +''''; 
                FETCH NEXT FROM cursor_pair  INTO @value, @orand,  @column_name, @compare;  
            END;  
            
            if(@sql <>'')
            set @sql ='('+ @sql+')'

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

    --    PRINT @sql;
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;

        IF EXISTS ( ( SELECT    *
                      FROM      tempdb..sysobjects
                      WHERE     id = OBJECT_ID('tempdb..#Tbtest_user')
                    ) )
            DROP TABLE [dbo].[#Tbtest_user];


        create  TABLE [dbo].[#Tbtest_user]
            (
              id2 INT IDENTITY ,
             -- department_name NVARCHAR(30) DEFAULT ( '' ) ,
              id INT DEFAULT ( 100 )
            ); 
    	
    	
    	 set @sql_where=' ( @email=email or @email='''' )
 and  ( @name=name or @name='''' )
 and  ( @department_id=department_id or @department_id=0 )
'
         set @sql_order ='
                ORDER BY 
                									CASE WHEN @sort = ''id''   AND @desc = ''desc'' THEN id END DESC ,   CASE WHEN @sort = ''id'' AND @desc = ''asc'' THEN id END ASC ,
									CASE WHEN @sort = ''add_on''   AND @desc = ''desc'' THEN add_on END DESC ,   CASE WHEN @sort = ''add_on'' AND @desc = ''asc'' THEN add_on END ASC ,
									CASE WHEN @sort = ''add_by''   AND @desc = ''desc'' THEN add_by END DESC ,   CASE WHEN @sort = ''add_by'' AND @desc = ''asc'' THEN add_by END ASC ,
									CASE WHEN @sort = ''user_name''   AND @desc = ''desc'' THEN user_name END DESC ,   CASE WHEN @sort = ''user_name'' AND @desc = ''asc'' THEN user_name END ASC ,
									CASE WHEN @sort = ''password''   AND @desc = ''desc'' THEN password END DESC ,   CASE WHEN @sort = ''password'' AND @desc = ''asc'' THEN password END ASC ,
									CASE WHEN @sort = ''email''   AND @desc = ''desc'' THEN email END DESC ,   CASE WHEN @sort = ''email'' AND @desc = ''asc'' THEN email END ASC ,
									CASE WHEN @sort = ''name''   AND @desc = ''desc'' THEN name END DESC ,   CASE WHEN @sort = ''name'' AND @desc = ''asc'' THEN name END ASC ,
									CASE WHEN @sort = ''department_id''   AND @desc = ''desc'' THEN department_id END DESC ,   CASE WHEN @sort = ''department_id'' AND @desc = ''asc'' THEN department_id END ASC ,
            
                        CASE WHEN @sort = ''''  THEN id
                        END desc  '
		
     
     
       if(@sql <>'' and @sql_where <>'')
                   SET @sql_where= @sql + ' and ' + @sql_where;
    IF(@sql_where <>'')
			SET @sql_where =' where '+@sql_where
			 SET @sql2 = 'SELECT @total_row = COUNT(*)
        FROM    test_user WITH ( NOLOCK ) '  +@sql_where
        
        
        
         EXEC sp_executesql @sql2, N'
          @total_row int output ,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
',  @total_row OUTPUT,@email
,@name
,@department_id
;   
        PRINT @total_row;
        
        
        
        SET @sql2 = '        INSERT  INTO [#Tbtest_user]
               ( id
		        )
               SELECT TOP ( @start_index + @page_size )   id 
               
      FROM    test_user WITH ( NOLOCK ) '  +@sql_where+@sql_order
      
      
      
         EXEC sp_executesql @sql2, N'
          @start_index int, @page_size int, @desc varchar(20), @sort varchar(20) ,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
,@department_id int--部门编号
', @start_index  , @page_size  , @desc  , @sort  ,@email
,@name
,@department_id
;   
             	
       DELETE  #Tbtest_user
        WHERE   id2 <= @start_index;

        SELECT  t.*  
        FROM    test_user t
                JOIN [#Tbtest_user] o ON t.id = o.id
        ORDER BY o.id2;         
    END 
        


GO
/****** Object:  StoredProcedure [dbo].[vdp_test_user_search]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-11
//       作者： fdsaf   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_test_user_search]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    	,@user_name nvarchar(100) --用户名
,@email nvarchar(300) --email
,@name nvarchar(30) --姓名
 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI 页序号从1开始，这里减一以修正
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [test_user] WITH ( NOLOCK ) 
        	 where (  @user_name=user_name or @user_name='' )
 and (  @email=email or @email='' )
 and (  @name=name or @name='' )
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [test_user] WITH ( NOLOCK ) 
                	 where (  @user_name=user_name or @user_name='' )
 and (  @email=email or @email='' )
 and (  @name=name or @name='' )
         
                ORDER BY 
                									CASE WHEN @sort = 'id' AND @desc = 'desc' THEN [id] END DESC , CASE WHEN @sort = 'id' AND @desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @sort = 'add_on' AND @desc = 'desc' THEN [add_on] END DESC , CASE WHEN @sort = 'add_on' AND @desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @sort = 'add_by' AND @desc = 'desc' THEN [add_by] END DESC , CASE WHEN @sort = 'add_by' AND @desc = 'asc' THEN [add_by] END ASC ,
									CASE WHEN @sort = 'user_name' AND @desc = 'desc' THEN [user_name] END DESC , CASE WHEN @sort = 'user_name' AND @desc = 'asc' THEN [user_name] END ASC ,
									CASE WHEN @sort = 'password' AND @desc = 'desc' THEN [password] END DESC , CASE WHEN @sort = 'password' AND @desc = 'asc' THEN [password] END ASC ,
									CASE WHEN @sort = 'email' AND @desc = 'desc' THEN [email] END DESC , CASE WHEN @sort = 'email' AND @desc = 'asc' THEN [email] END ASC ,
									CASE WHEN @sort = 'name' AND @desc = 'desc' THEN [name] END DESC , CASE WHEN @sort = 'name' AND @desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @sort = 'department_id' AND @desc = 'desc' THEN [department_id] END DESC , CASE WHEN @sort = 'department_id' AND @desc = 'asc' THEN [department_id] END ASC ,
            
                        CASE WHEN @sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [test_user] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    


GO
/****** Object:  StoredProcedure [dbo].[vdp_update_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//       描述：更新表Base_Action数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_Action]
    @id INT ,
    @menu_code VARCHAR(50) ,
    @action_url_name VARCHAR(50) ,
    @button_name VARCHAR(50) ,
    @procedure_name VARCHAR(150) ,
    @action_type VARCHAR(50),
	@sql VARCHAR(MAX),
	@sql_type VARCHAR(20)
AS
    BEGIN 
       
       
        UPDATE  [vd_Action]
        SET     [menu_code] = @menu_code ,
                [action_url_name] = @action_url_name ,
                [button_name] = @button_name ,
                [procedure_name] = @procedure_name ,
                [action_type] = @action_type,
				[sql] = @sql,
				sql_type = @sql_type
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_Base_Action]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-27 14:26:39
//       作者： 蔡捷     
//			  
//       描述：更新表Base_Action数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_Base_Action]
    @id INT ,
    @menu_code VARCHAR(50) ,
    @action_url_name VARCHAR(50) ,
    @button_name VARCHAR(50) ,
    @procedure_name VARCHAR(150) ,
    @action_type VARCHAR(50) ,
    @comments NVARCHAR(2000) ,
    @auth_flag INT ,
    @sql VARCHAR(MAX) ,
    @sql_type VARCHAR(20) ,
    @conn_str VARCHAR(20)
AS
    BEGIN 
       
       
        UPDATE  [vd_action]
        SET     [menu_code] = @menu_code ,
                [action_url_name] = @action_url_name ,
                [button_name] = @button_name ,
                [procedure_name] = @procedure_name ,
                [action_type] = @action_type ,
                comments = @comments ,
                auth_flag = @auth_flag ,
                [sql] = @sql ,
                sql_type = @sql_type ,
                conn_str = @conn_str
        WHERE   [id] = @id; 
        
		
        EXEC sys_add_proc_old @menu_code = @menu_code,
            @action_name = @action_url_name, @button_name = @button_name,
            @proc_name = @procedure_name, @action_type = @action_type,
            @comments = @comments;
    
    END; 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_Base_Procedure_Parameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//       描述：更新表Base_Procedure_Parameters数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_update_Base_Procedure_Parameters] 
 @id int
,@from__where varchar(150)
 
 
 AS
    BEGIN 
       
       
          UPDATE  vd_Proc_Parameters
        SET   
         [from__where] =  @from__where
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_BaseUser]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


alter   PROCEDURE [dbo].[vdp_update_BaseUser]
    @user_id INT ,
    @user_code VARCHAR(64) ,
    @real_name VARCHAR(64) ,
    @sex VARCHAR(64) ,
    @phone VARCHAR(64) ,
    @email VARCHAR(64) ,
    @QQ VARCHAR(64) ,
    @sort INT ,
    @remark VARCHAR(128) , 
    @department_id INT --,
   -- @HeadImgURL VARCHAR(300) ,
   -- @city NVARCHAR(100) ,
   -- @Province NVARCHAR(40)
AS
    BEGIN 
       
       
        UPDATE  [vd_User]
        SET     [user_code] = @user_code ,
                [real_name] = @real_name ,
                [sex] = @sex ,
                [phone] = @phone ,
                [email] = @email-- ,
                --[QQ] = @QQ ,
                --[sort] = @sort ,
                --[enabled] = 1 ,
                --[remark] = @remark --,  
                --[HeadImgURL] = @HeadImgURL ,
               -- [city] = @city ,
              -- [Province] = @Province
        WHERE   id = @user_id
               -- AND [department_id] = @department_id
    END 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_update_config]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_update_config]
    @page_detail_id INT
AS
BEGIN

        DECLARE @start_index INT ,
            @table_name VARCHAR(30)
 SELECT  @table_name = table_name
        FROM    dbo.vd_page_detail
        WHERE   id = @page_detail_id 

        INSERT  INTO dbo.vd_page_detail_config
                ( page_detail_id ,
                  is_show ,
                  is_where ,
                  is_insert ,
                  is_update ,
                  width ,
                  data ,
                  valid ,
                  is_required ,
                  column_name ,
                  column_description ,
                  column_type ,
                  column_length ,
                  html_type ,
                  static_value,
				  table_name,col_alias
			    )
                SELECT DISTINCT @page_detail_id , -- page_detail_id - int
                        1 , -- is_show - int
                        0 , -- is_where - int
                        1 , -- is_insert - int
                        1 , -- is_update - int
                        0 , -- width - int
                        N'' , -- data - nvarchar(250)
                        N'' , -- valid - nvarchar(250)
                        0 , -- is_required - int
                        column_name , -- column_name - varchar(50)
                       ISNULL(  column_description ,  column_name) column_description, -- column_description - nvarchar(150)
                        type , -- column_type - nvarchar(20)
                        length , -- column_length - int
                        'textbox' , -- html_type - varchar(20)
                        N''  -- static_value - nvarchar(50)
						,@table_name,
						column_name
                FROM    dbo.v_table
                WHERE   table_name = @table_name
                        AND column_name NOT IN (
                        SELECT  column_name
                        FROM    vd_page_detail_config
                        WHERE   Table_Name = @table_name  AND @page_detail_id = page_detail_id)

        DELETE  dbo.vd_page_detail_config
        WHERE   page_detail_id = @page_detail_id 
                AND column_name NOT IN ( SELECT  column_name
                                        FROM    dbo.v_table
                                        WHERE   table_name = @table_name )
end

GO
/****** Object:  StoredProcedure [dbo].[vdp_update_ProcParameters]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-03-28 09:07:28
//       作者： 蔡捷     
//			  
//       描述：更新表Base_Procedure_Parameters数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_ProcParameters]
    @id INT ,
    @from__where VARCHAR(150)
AS
    BEGIN 
       
       
        UPDATE  [vd_Proc_Parameters]
        SET     [from__where] = @from__where
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_sub_page]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：插入数据到表vd_page
//------------------------------------------------------------------------------
exec [vdp_update_sub_page] 0,'fdasf','test',7,'flow', 1
*/


alter   PROCEDURE [dbo].[vdp_update_sub_page]
    @id INT ,
    @page_name VARCHAR(150) ,
    @page_name_text VARCHAR(150) ,
    @parent_id INT ,
    @table_name VARCHAR(150) ,
    @module_id INT
AS
    BEGIN 
        DECLARE @m VARCHAR(60);
        DECLARE @class_name VARCHAR(150);
        DECLARE @contrller VARCHAR(60);
        DECLARE @area VARCHAR(60);
        DECLARE @pid INT;
        DECLARE @pdid INT;
        DECLARE @old_table_name VARCHAR(60);


        SELECT  @m = page_name ,
                @contrller = controller ,
                @area = controller_area
        FROM    dbo.vd_page
        WHERE   id = @parent_id;

        IF @id = 0
            BEGIN
                SET @class_name = @page_name;
                SET @page_name = @m + '$' + @page_name;

                IF EXISTS ( SELECT  1
                            FROM    [vd_page]
                            WHERE   [page_name] = @page_name )
                    BEGIN
	    
                        SET @m = @page_name + '已经存在';
                        RAISERROR( @m,16,1);    
                        RETURN;
       

                    END;
       
                INSERT  INTO [vd_page]
                        ( [template_id] ,
                          [page_name] ,
                          [description] ,
                          [parent_menu_code] ,
                          page_name_text ,
                          controller_area ,
                          controller, parent_id
                        )
                VALUES  ( 17 ,--简单模板
                          @page_name ,
                          '' ,
                          '' ,
                          @page_name_text ,
                          @area ,
                          @contrller,@parent_id
                        );

                SET @pid = @@IDENTITY;

                INSERT  INTO dbo.vd_page_detail
                        ( page_id ,
                          area ,
                          table_name ,
                          module_id ,
                          comments ,
                          name_text ,
                          class_name
		                )
                VALUES  ( @pid , -- page_id - int
                          'a' , -- area - varchar(10)
                          @table_name , -- table_name - varchar(50)
                          @module_id , -- module_id - int
                          'sub page' , -- comments - varchar(2000)
                          @page_name_text , -- name_text - varchar(50)
                          @class_name  -- class_name - varchar(50)
		                );
                SET @pdid = @@IDENTITY;
            END;
        ELSE
            BEGIN
			  SET @class_name = @page_name;
                IF CHARINDEX( @m,@page_name) < 1
                    SET @page_name = @m + '$' + @page_name;
				
                --SELECT  @old_table_name = table_name
                --FROM    dbo.vd_page_detail
                --WHERE   id = @pdid;

               -- IF ( @old_table_name <> @page_name )

                UPDATE  [vd_page]
                SET     page_name = @page_name ,
                        controller_area = @area ,
                        controller = @contrller ,
                        page_name_text = @page_name_text
                WHERE   @id = id;

                SELECT  @pdid = id
                FROM    dbo.vd_page_detail
                WHERE   page_id = @id;

                    DELETE  dbo.vd_page_detail_config
                    WHERE   page_detail_id = @pdid AND table_name <>@page_name;

                UPDATE  dbo.vd_page_detail
                SET     table_name = @table_name ,
                        name_text = @page_name_text ,
                        class_name = @class_name ,
                        module_id = @module_id
                WHERE   @pdid = id;


 
 SET @pid = @id

            END;
        
		 -- EXEC usp_update_config @pdid

        SELECT  @pid pid ,
                @pdid pdid;

    END; 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_SysTableSetup]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-01-23 11:00:16
//       作者： Jerry 
//       描述：更新表SysTableSetup数据
//------------------------------------------------------------------------------


DECLARE @x XML

SELECT @x = '

<Peoples>

    <People  Name="tudou" sex="女" />

    <People  Name="choushuigou" sex="女"/>

    <People  Name="dongsheng" sex="男" />

</Peoples>'

 

-- 方法1
SELECT

    v.value('@Name[1]','VARCHAR(20)') AS Name,

    v.value('@sex[1]','VARCHAR(20)') AS sex

FROM @x.nodes('/Peoples/People') x(v)


*/


alter    PROCEDURE [dbo].[vdp_update_SysTableSetup]
    @table_name VARCHAR(50) ,
    @class_name VARCHAR(50) ,
    @author NVARCHAR(100) ,
    @comments NVARCHAR(1000) ,
    @area_name VARCHAR(50) ,
    @company NVARCHAR(100) ,
    @XML XML
AS
    BEGIN 
        DECLARE @id INT
         
        
        SELECT  @id = id
        FROM    [SysTableSetup]
        WHERE   [table_name] = @table_name
                AND [class_name] = @class_name
                            
                            
        IF EXISTS ( SELECT  *
                    FROM    [SysTableSetup]
                    WHERE   [table_name] = @table_name
                            AND [class_name] = @class_name )
            UPDATE  [SysTableSetup]
            SET     [table_name] = @table_name ,
                    [class_name] = @class_name ,
                    [author] = @author ,
                    [comments] = @comments ,
                    [area_name] = @area_name ,
                    [company] = @company
            WHERE   [table_name] = @table_name
                    AND [class_name] = @class_name  
        ELSE
            BEGIN
                
                INSERT  INTO [SysTableSetup]
                        ( [table_name] ,
                          [class_name] ,
                          [author] ,
                          [comments] ,
                          [add_date] ,
                          [area_name] ,
                          [company]
                        )
                VALUES  ( @table_name ,
                          @class_name ,
                          @author ,
                          @comments ,
                          GETDATE() ,
                          @area_name ,
                          @company
                        )
                SET @id = @@IDENTITY
                
            END
            
        DELETE  dbo.SysColumnSetup
        WHERE   table_id = @id            
     
        DECLARE @is_show INT
        DECLARE @is_insert INT
        DECLARE @is_update INT
        DECLARE @width INT
        DECLARE @data NVARCHAR(250)
        DECLARE @valid NVARCHAR(250)
        DECLARE @is_required INT 
        DECLARE @column_name VARCHAR(50)
        DECLARE @column_description NVARCHAR(150)
        DECLARE @column_type NVARCHAR(20)
        DECLARE @column_length INT
        DECLARE @html_type NVARCHAR(250)
        DECLARE @static_value NVARCHAR(250)

        DECLARE cursor_SysColumnSetup CURSOR LOCAL
        FOR
            SELECT  v.value('@is_show[1]', 'int') AS is_show ,
                    v.value('@is_insert[1]', 'int') AS is_insert ,
                    v.value('@is_update[1]', 'int') AS is_update ,
                    v.value('@width[1]', 'int') AS width ,
                    v.value('@data[1]', 'nvarchar(250)') AS data ,
                    v.value('@valid[1]', 'nvarchar(250)') AS valid ,
                    v.value('@is_required[1]', 'int') AS is_required ,
                    v.value('@column_name[1]', 'nvarchar(50)') AS column_name ,
                    v.value('@column_description[1]', 'nvarchar(150)') AS column_description ,
                    v.value('@column_type[1]', 'nvarchar(20)') AS column_type ,
                    v.value('@column_length[1]', 'int') AS column_length ,
                    v.value('@static_value[1]', 'nvarchar(250)') AS static_value ,
                    v.value('@html_type[1]', 'nvarchar(250)') AS html_type
            FROM    @XML.nodes('/Table/Column') XML ( v )
	
--WHERE  id >10

        OPEN  cursor_SysColumnSetup   
        FETCH NEXT FROM cursor_SysColumnSetup  INTO @is_show, @is_insert,
            @is_update, @width, @data, @valid, @is_required, @column_name,
            @column_description, @column_type, @column_length, @static_value,
            @html_type
        WHILE @@FETCH_STATUS = 0
            BEGIN   
                
                
                INSERT  INTO [SysColumnSetup]
                        ( [is_show] ,
                          [is_insert] ,
                          [is_update] ,
                          [width] ,
                          [data] ,
                          [valid] ,
                          [is_required] ,
                          [table_id] ,
                          [column_name] ,
                          [column_description] ,
                          [column_type] ,
                          [column_length] ,
                          static_value ,
                          html_type
                        )
                VALUES  ( @is_show ,
                          @is_insert ,
                          @is_update ,
                          @width ,
                          @data ,
                          @valid ,
                          @is_required ,
                          @id ,
                          @column_name ,
                          @column_description ,
                          @column_type ,
                          @column_length ,
                          @static_value ,
                          @html_type
                        )
                FETCH NEXT FROM cursor_SysColumnSetup  INTO @is_show, @is_insert,
                    @is_update, @width, @data, @valid, @is_required, @column_name,
                    @column_description, @column_type, @column_length,
                    @static_value, @html_type
            END  

        CLOSE cursor_SysColumnSetup   
        DEALLOCATE cursor_SysColumnSetup
       
        
    
    END


GO
/****** Object:  StoredProcedure [dbo].[vdp_update_template_module]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter  PROC [dbo].[vdp_update_template_module]
    @template_id INT ,
    @module_id INT  
AS
    BEGIN
	 

        IF EXISTS ( SELECT  1
                    FROM    vd_template_module
                    WHERE   template_id = @template_id
                            AND module_id = @module_id )
            BEGIN
				 
                    
                DELETE  vd_template_module
                WHERE   template_id = @template_id
                            AND module_id = @module_id
            END
        ELSE
            BEGIN
				 INSERT dbo.vd_template_module
				         ( template_id, module_id )
				 VALUES  ( @template_id, -- template_id - int
				           @module_id  -- module_id - int
				           )  

            END


    END

GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_module]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：更新表vd_module数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_module]
    @id INT ,
    @template_id INT ,
    @module_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @files_text NVARCHAR(1000) ,
    @edit_flag INT,
    @language  VARCHAR(50) ,
    @js_framwork VARCHAR(50)
AS
    BEGIN 
       
       
        UPDATE  [vd_module]
        SET     [template_id] = @template_id ,
                [module_name] = @module_name ,
                [description] = @description ,
                [files_text] = @files_text ,
                edit_flag = @edit_flag,
				[language]=@language,
				js_framwork=@js_framwork
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_page]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：更新表vd_page数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_page]
    @id INT ,
    @template_id INT ,
    @page_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @parent_menu_code VARCHAR(20) ,
    @page_name_text VARCHAR(50),
	@controller_area VARCHAR(50),
	@controller  VARCHAR(50)
AS
    BEGIN 
       
       
        UPDATE  [vd_page]
        SET     [template_id] = @template_id ,
                [page_name] = @page_name ,
                [description] = @description ,
                [parent_menu_code] = @parent_menu_code ,
                page_name_text = @page_name_text,
				controller_area = @controller_area,
				controller = @controller
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_page_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：更新表vd_page_detail数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_page_detail]
    @id INT ,
    @area VARCHAR(10) ,
    @table_name VARCHAR(50) ,
    @module_id INT ,
    @comments VARCHAR(2000) ,
    @name_text VARCHAR(50) ,
    @class_name VARCHAR(50)
AS
    BEGIN 
       
	   IF @class_name=''
	   SET @class_name = @table_name
       
        UPDATE  [vd_page_detail]
        SET     [area] = @area ,
                [table_name] = @table_name ,
                [module_id] = @module_id ,
                [comments] = @comments ,
                name_text = @name_text ,
                class_name = @class_name
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_page_detail_config]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：更新表vd_page_detail_config数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_page_detail_config]
    @id INT ,
    @is_show INT ,
    @is_where INT ,
    @is_insert INT ,
    @is_update INT ,
    @width INT ,
    @data NVARCHAR(500) ,
    @valid NVARCHAR(500) ,
    @is_required INT ,
    @column_name VARCHAR(50) ,
    @column_description NVARCHAR(300) ,
    @column_type NVARCHAR(40) ,
    @column_length INT ,
    @html_type VARCHAR(20) ,
    @static_value NVARCHAR(100) ,
    @column_caption NVARCHAR(300) ,
    @table_name VARCHAR(30),
	@col_alias VARCHAR(150)
AS
    BEGIN 
	 
	 
        EXEC [vdp_addtableculumncaption] @table_name, @column_name,
            @column_caption
        EXEC [vdp_addtableculumndescription] @table_name, @column_name,
            @column_caption 


        UPDATE  [vd_page_detail_config]
        SET     [is_show] = @is_show ,
                [is_where] = @is_where ,
                [is_insert] = @is_insert ,
                [is_update] = @is_update ,
                [width] = @width ,
                [data] = @data ,
                [valid] = @valid ,
                [is_required] = @is_required ,
                [column_name] = @column_name ,
                [column_description] = @column_description ,
                [column_type] = @column_type ,
                [column_length] = @column_length ,
                [html_type] = @html_type ,
                [static_value] = @static_value,
				col_alias = @col_alias
				--, column_caption = @column_caption
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_Source]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-15
//       作者： 蔡捷     
//			  
//       描述：更新表vd_Source数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_Source] @id INT
AS
    BEGIN 
       
       
        UPDATE  [vd_Source]
        SET     [publish_flag] = 0
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_update_vd_template]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       描述：更新表vd_template数据
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_update_vd_template]
    @id INT ,
    @template_name VARCHAR(50) ,
    @description VARCHAR(500) ,
    @files VARCHAR(300) ,
    @html VARCHAR(2000) ,
    @areas VARCHAR(150) ,
    @language VARCHAR(50) ,
    @js_framwork VARCHAR(50)
AS
    BEGIN 
       
       
        UPDATE  [vd_template]
        SET     [template_name] = @template_name ,
                [description] = @description ,
                [files] = @files ,
                [html] = @html ,
                [areas] = @areas ,
                [language] = @language ,
                js_framwork = @js_framwork
        WHERE   [id] = @id 
        
    
    END 
    






GO
/****** Object:  StoredProcedure [dbo].[vdp_User_delete]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷  
//			 用户 
//       描述：删除表vd_User数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_User_delete] 
 @id int--编号
 
 
 AS
    BEGIN 
       
       
          Delete  [vd_User]
        
        WHERE   [id] = @id 
        
    
    END 


GO
/****** Object:  StoredProcedure [dbo].[vdp_User_detail]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  PROC [dbo].[vdp_User_detail]
@add_by INT
AS
BEGIN

SELECT * FROM dbo.vd_User WHERE id = @add_by

END


GO
/****** Object:  StoredProcedure [dbo].[vdp_User_insert]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/* 
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 用户 
//       描述：插入数据到表vd_User
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_User_insert]
    @user_type INT--用户类型
    ,
    @user_code VARCHAR(64)--用户代码
 --   ,
--    @password VARCHAR(128)--口令
    ,
    @real_name VARCHAR(64)--姓名
    ,
    @spell VARCHAR(64)--拼写
    ,
    @sex VARCHAR(64)--性别
    ,
    @phone VARCHAR(64)--电话
    ,
    @email VARCHAR(64)--电子邮件
    ,
    @department_id INT--部门编号
    ,
    @add_by INT--创建人
AS
    BEGIN 
	DECLARE @m VARCHAR(30),@uid int
       
	   IF EXISTS(SELECT 1 FROM [vd_User] WHERE user_code = @user_code)
	   BEGIN
	    
	   SET @m=@user_code +'已经存在'
	   Raiserror( @m,16,1)    
	   RETURN
       

	   END
       
       
        INSERT  INTO [vd_User]
                ( [user_type] ,
                  [user_code] ,
                  [password] ,
                  [real_name] ,
                  [spell] ,
                  [sex] ,
                  [phone] ,
                  [email] ,
                  [department_id] ,
                  [add_by] ,
                  [add_on] ,active
                )
        VALUES  ( @user_type ,
                  @user_code ,
                  'e10adc3949ba59abbe56e057f20f883e' ,
                  @real_name ,
                  @spell ,
                  @sex ,
                  @phone ,
                  @email ,
                  @department_id ,
                  @add_by ,
                  GETDATE(), 1
                );
				SET @uid = @@IDENTITY
        INSERT dbo.vd_User_Role
                ( user_id, role_id )
        VALUES  ( @uid, -- user_id - int
                  9  -- role_id - varchar(20)
                  )
    
	 
    END; 


GO
/****** Object:  StoredProcedure [dbo].[vdp_User_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 
 
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 用户 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_User_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    ,
    @department_id INT--部门编号
AS
    BEGIN 
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1)
                            NOT NULL ,
              id INT--编号
            ); 
	
        SELECT  @total_row = COUNT(*)
        FROM    vd_User WITH ( NOLOCK )
        WHERE   @department_id = department_id;
       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                        id
                FROM    vd_User WITH ( NOLOCK )
                WHERE   @department_id = department_id
                ORDER BY CASE WHEN @sort = 'id'
                                   AND @desc = 'desc' THEN id
                         END DESC ,
                        CASE WHEN @sort = 'id'
                                  AND @desc = 'asc' THEN id
                        END ASC ,
                        CASE WHEN @sort = 'user_type'
                                  AND @desc = 'desc' THEN user_type
                        END DESC ,
                        CASE WHEN @sort = 'user_type'
                                  AND @desc = 'asc' THEN user_type
                        END ASC ,
                        CASE WHEN @sort = 'user_code'
                                  AND @desc = 'desc' THEN user_code
                        END DESC ,
                        CASE WHEN @sort = 'user_code'
                                  AND @desc = 'asc' THEN user_code
                        END ASC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'desc' THEN password
                        END DESC ,
                        CASE WHEN @sort = 'password'
                                  AND @desc = 'asc' THEN password
                        END ASC ,
                        CASE WHEN @sort = 'secretkey'
                                  AND @desc = 'desc' THEN secretkey
                        END DESC ,
                        CASE WHEN @sort = 'secretkey'
                                  AND @desc = 'asc' THEN secretkey
                        END ASC ,
                        CASE WHEN @sort = 'real_name'
                                  AND @desc = 'desc' THEN real_name
                        END DESC ,
                        CASE WHEN @sort = 'real_name'
                                  AND @desc = 'asc' THEN real_name
                        END ASC ,
                        CASE WHEN @sort = 'spell'
                                  AND @desc = 'desc' THEN spell
                        END DESC ,
                        CASE WHEN @sort = 'spell'
                                  AND @desc = 'asc' THEN spell
                        END ASC ,
                        CASE WHEN @sort = 'sex'
                                  AND @desc = 'desc' THEN sex
                        END DESC ,
                        CASE WHEN @sort = 'sex'
                                  AND @desc = 'asc' THEN sex
                        END ASC ,
                        CASE WHEN @sort = 'phone'
                                  AND @desc = 'desc' THEN phone
                        END DESC ,
                        CASE WHEN @sort = 'phone'
                                  AND @desc = 'asc' THEN phone
                        END ASC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'desc' THEN email
                        END DESC ,
                        CASE WHEN @sort = 'email'
                                  AND @desc = 'asc' THEN email
                        END ASC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'desc' THEN department_id
                        END DESC ,
                        CASE WHEN @sort = 'department_id'
                                  AND @desc = 'asc' THEN department_id
                        END ASC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'desc' THEN add_by
                        END DESC ,
                        CASE WHEN @sort = 'add_by'
                                  AND @desc = 'asc' THEN add_by
                        END ASC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'desc' THEN add_on
                        END DESC ,
                        CASE WHEN @sort = 'add_on'
                                  AND @desc = 'asc' THEN add_on
                        END ASC ,
                        CASE WHEN @sort = ' ' THEN id
                        END DESC;  
		
        DELETE  @table
        WHERE   new_index <= @start_index;
         
        SELECT  c.id ,
                c.user_type ,
                c.user_code ,  
                c.real_name ,
                c.spell ,
                c.sex ,
                c.phone ,
                c.email ,
                c.department_id ,
                c.add_by ,
                c.add_on
        FROM    vd_User c WITH ( NOLOCK )
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index; 
    
    END; 
    



   




GO
/****** Object:  StoredProcedure [dbo].[vdp_user_role_check]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

 alter   PROCEDURE [dbo].[vdp_user_role_check] @rid INT--编号
    , @uid INT
 AS
    BEGIN 
       
        IF EXISTS ( SELECT  1
                    FROM    dbo.vd_User_Role
                    WHERE   user_id = @uid
                            AND role_id = @rid )
            DELETE  [vd_User_Role]
            WHERE   user_id = @uid
                    AND role_id = @rid;
					ELSE
                    INSERT INTO dbo.vd_User_Role
                            ( user_id, role_id )
                    VALUES  ( @uid, -- user_id - int
                              @rid  -- role_id - varchar(20)
                              )
        
    
    END; 
    

GO
/****** Object:  StoredProcedure [dbo].[vdp_user_role_pager_check]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-16
//       作者： 蔡捷2   
//			 用户角色 
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

*/


alter   PROCEDURE [dbo].[vdp_user_role_pager_check]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) --排序方向asc or desc
    ,
    @user_id INT--用户编号
AS
    BEGIN 
        SET @total_row = 10;

        --DECLARE @start_index INT; 
        ----EasyUI 页序号从1开始，这里减一以修正
        --SET @page_index = @page_index - 1;
        --SET @start_index = @page_size * @page_index;
        --DECLARE @table TABLE
        --    (
        --      new_index INT IDENTITY(1, 1)
        --                    NOT NULL ,
        --      id INT--编号
        --    ); 
	
        --SELECT  @total_row = COUNT(*)
        --FROM    vd_User_Role WITH ( NOLOCK )
        --WHERE   @user_id = user_id;
       
        --INSERT  INTO @table
        --        ( id
		      --  )
        --        SELECT TOP ( @start_index + @page_size )
        --                id
        --        FROM    vd_User_Role WITH ( NOLOCK )
        --        WHERE   @user_id = user_id
        --        ORDER BY CASE WHEN @sort = 'id'
        --                           AND @desc = 'desc' THEN id
        --                 END DESC ,
        --                CASE WHEN @sort = 'id'
        --                          AND @desc = 'asc' THEN id
        --                END ASC ,
        --                CASE WHEN @sort = 'user_id'
        --                          AND @desc = 'desc' THEN user_id
        --                END DESC ,
        --                CASE WHEN @sort = 'user_id'
        --                          AND @desc = 'asc' THEN user_id
        --                END ASC ,
        --                CASE WHEN @sort = 'role_id'
        --                          AND @desc = 'desc' THEN role_id
        --                END DESC ,
        --                CASE WHEN @sort = 'role_id'
        --                          AND @desc = 'asc' THEN role_id
        --                END ASC ,
        --                CASE WHEN @sort = ' ' THEN id
        --                END DESC;  
		
        --DELETE  @table
        --WHERE   new_index <= @start_index;
         
        SELECT  ISNULL(c.id, 0) checked ,
                r.id ,
                r.role_code ,
                r.role_name ,
                r.role_type ,
                r.sort
        FROM    dbo.vd_Role r
                LEFT	JOIN vd_User_Role c WITH ( NOLOCK ) ON r.id = c.role_id
                                                              AND c.user_id = @user_id;
    
    END; 

GO
/****** Object:  StoredProcedure [dbo].[vdp_User_update]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷  
//			 用户 
//       描述：更新表vd_User数据
//------------------------------------------------------------------------------

*/


 alter   PROCEDURE [dbo].[vdp_User_update] 
 @id int--编号
,@user_type int--用户类型
,@user_code varchar(64)--用户代码
,@real_name varchar(64)--姓名
,@spell varchar(64)--拼写
,@sex varchar(64)--性别
,@phone varchar(64)--电话
,@email varchar(64)--电子邮件
 ,@active int
 
 AS
    BEGIN 
       		--更新表vd_User
          UPDATE  [vd_User]
        SET   
         [user_type] =  @user_type
,[user_code] =  @user_code
,[real_name] =  @real_name
,[spell] =  @spell
,[sex] =  @sex
,[phone] =  @phone
,[email] =  @email
,active = @active
        WHERE   [id] = @id 
        
    
    END 
    


GO
/****** Object:  StoredProcedure [dbo].[vdp_validation_list]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 alter   PROCEDURE [dbo].[vdp_validation_list] 
  	AS
    BEGIN 
          select 
           [name]  [text] 
,[valid_text]  [id] 
From  [vd_validation]
        
    	END 


GO
/****** Object:  StoredProcedure [dbo].[vdp_vd_Department_pager]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-08
//       作者： 蔡捷   
//			  
//			@page_index 页面号
//			@page_size  每页行数 
//			@total_row  总共行数 
//			@sort 			排序字段 
//			@desc 排序方向asc or desc
//------------------------------------------------------------------------------

exec [vdp_vd_Department_pager] 1,5,0,'','','&ltroot&gt&ltitem column_name="add_on" value= "2018-01-10" compare= "gt" orand= ""/&gt &lt/root&gt','',0,''

SELECT *
        FROM    vd_Department WITH ( NOLOCK ) 
*/


alter   PROCEDURE [dbo].[vdp_vd_Department_pager]
    @page_index INT = 0 ,--页面号
    @page_size INT = 5 , --每页行数
    @total_row INT OUTPUT , -- 总共行数 
    @sort VARCHAR(40) , -- 排序字段
    @desc VARCHAR(10) , --排序方向asc or desc,
    @xml VARCHAR(MAX) ,
    @short_name VARCHAR(64) --简名
    ,
    @enabled INT--是否启用
    ,
    @remark VARCHAR(128) --备注
AS
    BEGIN 
    	
    	
        IF ( @xml = '' )
            SET @xml = '<root></root>';
    	
        SET @total_row = 10;
        SET @xml = REPLACE(@xml, '&gt;', '>');
        SET @xml = REPLACE(@xml, '&lt;', '<');
        SET @xml = REPLACE(@xml, '&gt', '>');
        SET @xml = REPLACE(@xml, '&lt', '<');
		PRINT @xml
        DECLARE @x XML;
        DECLARE @value VARCHAR(30) ,
            @column_name VARCHAR(30) ,
            @compare VARCHAR(20) ,
            @orand VARCHAR(20) ,
            @sql NVARCHAR(MAX) ,
            @sql2 NVARCHAR(MAX) ,
            @sql_where NVARCHAR(MAX) ,
            @sql_order NVARCHAR(MAX);
            

        SET @x = CAST(@xml AS XML); 
 
        DECLARE cursor_pair CURSOR LOCAL
        FOR
            SELECT  v.value('@value[1]', 'varchar(20)') AS value ,
                    v.value('@orand[1]', 'varchar(20)') AS orand ,
                    v.value('@column_name[1]', 'varchar(30)') AS column_name ,
                    v.value('@compare[1]', 'varchar(20)') AS compare
            FROM    @x.nodes('/root/item') XML ( v )
            ORDER BY column_name;

        OPEN  cursor_pair;  

        SET @sql = '';


        
        FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name,
            @compare;  
        WHILE @@FETCH_STATUS = 0
            BEGIN 
  				
                SET @compare = REPLACE(@compare, 'gt', '>');
                SET @compare = REPLACE(@compare, 'lt', '<'); 
                IF ( @sql = '' )
                    SET @sql = @sql + ' ' + @column_name + ' ' + @compare
                        + ' ''' + @value+''''; 
                ELSE
                    SET @sql = @sql + ' ' + @orand + ' ' + @column_name
                        --   + @compare + ' ' + @value; 
                     + @compare + ' ''' + @value+''''; 
                FETCH NEXT FROM cursor_pair  INTO @value, @orand, @column_name,
                    @compare;  
            END;  
            
        IF ( @sql <> '' )
            SET @sql = '(' + @sql + ')';

        CLOSE cursor_pair;   
        DEALLOCATE cursor_pair;

    PRINT @sql;
        DECLARE @start_index INT; 
        --EasyUI 页序号从1开始，这里减一以修正
        SET @page_index = @page_index - 1;
        SET @start_index = @page_size * @page_index;

        IF EXISTS ( ( SELECT    *
                      FROM      tempdb..sysobjects
                      WHERE     id = OBJECT_ID('tempdb..#Tbvd_Department')
                    ) )
            DROP TABLE [dbo].[#Tbvd_Department];


        create  TABLE [dbo].[#Tbvd_Department]
            (
              id2 INT IDENTITY ,
             -- department_name NVARCHAR(30) DEFAULT ( '' ) ,
              id INT DEFAULT ( 100 )
            ); 
    	
    	
        SET @sql_where = ' ( @short_name=short_name or @short_name='''' )
 and  ( @enabled=enabled or @enabled=0 )
 and  ( @remark=remark or @remark='''' )
';
        SET @sql_order = '
                ORDER BY 
                									CASE WHEN @sort = ''id''   AND @desc = ''desc'' THEN id END DESC ,   CASE WHEN @sort = ''id'' AND @desc = ''asc'' THEN id END ASC ,
									CASE WHEN @sort = ''parent_id''   AND @desc = ''desc'' THEN parent_id END DESC ,   CASE WHEN @sort = ''parent_id'' AND @desc = ''asc'' THEN parent_id END ASC ,
									CASE WHEN @sort = ''department_name''   AND @desc = ''desc'' THEN department_name END DESC ,   CASE WHEN @sort = ''department_name'' AND @desc = ''asc'' THEN department_name END ASC ,
									CASE WHEN @sort = ''short_name''   AND @desc = ''desc'' THEN short_name END DESC ,   CASE WHEN @sort = ''short_name'' AND @desc = ''asc'' THEN short_name END ASC ,
									CASE WHEN @sort = ''company_code''   AND @desc = ''desc'' THEN company_code END DESC ,   CASE WHEN @sort = ''company_code'' AND @desc = ''asc'' THEN company_code END ASC ,
									CASE WHEN @sort = ''sort''   AND @desc = ''desc'' THEN sort END DESC ,   CASE WHEN @sort = ''sort'' AND @desc = ''asc'' THEN sort END ASC ,
									CASE WHEN @sort = ''enabled''   AND @desc = ''desc'' THEN enabled END DESC ,   CASE WHEN @sort = ''enabled'' AND @desc = ''asc'' THEN enabled END ASC ,
									CASE WHEN @sort = ''remark''   AND @desc = ''desc'' THEN remark END DESC ,   CASE WHEN @sort = ''remark'' AND @desc = ''asc'' THEN remark END ASC ,
									CASE WHEN @sort = ''phone''   AND @desc = ''desc'' THEN phone END DESC ,   CASE WHEN @sort = ''phone'' AND @desc = ''asc'' THEN phone END ASC ,
									CASE WHEN @sort = ''email''   AND @desc = ''desc'' THEN email END DESC ,   CASE WHEN @sort = ''email'' AND @desc = ''asc'' THEN email END ASC ,
									CASE WHEN @sort = ''address''   AND @desc = ''desc'' THEN address END DESC ,   CASE WHEN @sort = ''address'' AND @desc = ''asc'' THEN address END ASC ,
									CASE WHEN @sort = ''fax''   AND @desc = ''desc'' THEN fax END DESC ,   CASE WHEN @sort = ''fax'' AND @desc = ''asc'' THEN fax END ASC ,
									CASE WHEN @sort = ''add_by''   AND @desc = ''desc'' THEN add_by END DESC ,   CASE WHEN @sort = ''add_by'' AND @desc = ''asc'' THEN add_by END ASC ,
									CASE WHEN @sort = ''add_on''   AND @desc = ''desc'' THEN add_on END DESC ,   CASE WHEN @sort = ''add_on'' AND @desc = ''asc'' THEN add_on END ASC ,
            
                        CASE WHEN @sort = ''''  THEN id
                        END desc  ';
		
     
     
        IF ( @sql <> ''
             AND @sql_where <> ''
           )
            SET @sql_where = @sql + ' and ' + @sql_where;
        IF ( @sql_where <> '' )
            SET @sql_where = ' where ' + @sql_where;
        SET @sql2 = 'SELECT @total_row = COUNT(*)
        FROM    vd_Department WITH ( NOLOCK ) ' + @sql_where;
        
        
        
        EXEC sp_executesql @sql2, N'
          @total_row int output ,@short_name varchar(64) --简名
,@enabled int--是否启用
,@remark varchar(128) --备注
', @total_row OUTPUT, @short_name, @enabled, @remark;   
        PRINT @total_row;
        
        
        
        SET @sql2 = '        INSERT  INTO [#Tbvd_Department]
               ( id
		        )
               SELECT TOP ( @start_index + @page_size )   id 
               
      FROM    vd_Department WITH ( NOLOCK ) ' + @sql_where + @sql_order;
      
      
      
        EXEC sp_executesql @sql2,
            N'
          @start_index int, @page_size int, @desc varchar(20), @sort varchar(20) ,@short_name varchar(64) --简名
,@enabled int--是否启用
,@remark varchar(128) --备注
', @start_index, @page_size, @desc, @sort, @short_name, @enabled, @remark;   
             	
        DELETE  #Tbvd_Department
        WHERE   id2 <= @start_index;

        SELECT  t.*
        FROM    vd_Department t
                JOIN [#Tbvd_Department] o ON t.id = o.id
        ORDER BY o.id2; 
        
    END; 


GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetChildrencompany_code]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 /*
创建：袁修志
日期：15:09 2015-12-26
函数说明：
根据公司代码company_code，递归获取所有子节点company_code。
select * from Base_company
select * from [dbo].[fn_GetChildrencompany_code]('000')
*/
alter  function [dbo].[fn_GetChildrencompany_code](@company_code varchar(128))
returns @t table(company_code varchar(128))
as
begin
    insert @t select company_code from Base_company where company_code = @company_code
    while @@rowcount > 0
        insert @t select a.company_code from Base_company as a inner join @t as b
        on a.ParentCode = b.company_code and a.company_code not in(select company_code from @t)
   return
end 




GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetChildrenDepartmentCode]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 /*
创建：袁修志
日期：15:09 2015-12-26
函数说明：
根据公司代码DepartmentCode，递归获取所有子节点DepartmentCode。
select * from Base_Department
select * from [dbo].[fn_GetChildrenDepartmentCode]('1007')
*/
alter  function [dbo].[fn_GetChildrenDepartmentCode](@DepartmentCode varchar(128))
returns @t table(DepartmentCode varchar(128))
as
begin
    insert @t select DepartmentCode from Base_Department where DepartmentCode = @DepartmentCode
    while @@rowcount > 0
        insert @t select a.DepartmentCode from Base_Department as a inner join @t as b
        on a.ParentCode = b.DepartmentCode and a.DepartmentCode not in(select DepartmentCode from @t)
   return
end 




GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetChildrendict_code]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 /*
创建：袁修志
日期：15:09 2015-12-26
函数说明：
根据公司代码dict_code，递归获取所有子节点dict_code。
select * from Base_Dict
select * from [dbo].[fn_GetChildrendict_code]('000')
*/
alter  function [dbo].[fn_GetChildrendict_code](@dict_code varchar(128))
returns @t table(dict_code varchar(128))
as
begin
    insert @t select dict_code from Base_Dict where dict_code = @dict_code
    while @@rowcount > 0
        insert @t select a.dict_code from Base_Dict as a inner join @t as b
        on a.Parentdict_code = b.dict_code and a.dict_code not in(select dict_code from @t)
   return
end 




GO
/****** Object:  UserDefinedFunction [dbo].[fn_GetChildrenMenu]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
创建：袁修志
日期：23:28 2015-11-13
函数说明：
根据菜单menu_code，递归获取所有子节点menu_code。
select * from [dbo].[fn_GetChildrenMenu]('menu_dev')
*/
alter  function [dbo].[fn_GetChildrenMenu](@menu_code varchar(128))
returns @t table(menu_code varchar(128))
as
begin
    insert @t select menu_code from Base_Menu where menu_code = @menu_code
    while @@rowcount > 0
        insert @t select a.menu_code from Base_Menu as a inner join @t as b
        on a.ParentCode = b.menu_code and a.menu_code not in(select menu_code from @t)
   return
end 



GO
/****** Object:  UserDefinedFunction [dbo].[fn_splitStr]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter    function [dbo].[fn_splitStr]
(
@str	varchar(max),--字符串
@split  varchar(2)	 --分割符
)   
returns @t table
(
id int identity(1,1),
col varchar(max)
)   
as   
begin
/*
创建：袁修志
日期：2011-10-08
说明：函数(fn_splitStr),按照指定的分割符分割字符串，返回分割后的字符串表
*/
   while(charindex(@split,@str)<>0)   
    begin   
      insert @t(col) values(substring(@str,1,charindex(@split,@str)-1))   
      set  @str= stuff(@str,1,charindex(@split,@str),'')   
    end   
	insert @t(col) values (@str)
	return
end   





GO
/****** Object:  UserDefinedFunction [dbo].[fn_splitStrGetlength]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 alter  function [dbo].[fn_splitStrGetlength]
(
  @str varchar(1024),  --要分割的字符串
  @split varchar(10)  --分隔符号
)
returns int
as
begin
/*
创建：袁修志 21:28 2015-11-02
说明：按指定符号分割字符串，返回分割后的元素个数。
方法很简单，就是看字符串中存在多少个分隔符号，然后再加一，就是要求的结果。
调用示例：
select dbo.fn_splitStrGetlength('78,1,2,3',',')
返回值：4
*/
  declare @location int
  declare @start int
  declare @length int

  set @str=ltrim(rtrim(@str))
  set @location=charindex(@split,@str)
  set @length=1
  while @location<>0
  begin
    set @start=@location+1
    set @location=charindex(@split,@str,@start)
    set @length=@length+1
  end
  return @length
end




GO
/****** Object:  UserDefinedFunction [dbo].[fn_splitStrOfIndex]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter  function [dbo].[fn_splitStrOfIndex]
(
  @str varchar(1024),  --要分割的字符串
  @split varchar(10),  --分隔符号
  @index int --取第几个元素
)
returns varchar(1024)
as
begin
/*
创建：袁修志 21:31 2015-11-02 
说明：按指定符号分割字符串，返回分割后指定索引的第几个元素，象数组一样方便
调用示例：
select dbo.fn_splitStrOfIndex('8,9,4',',',2)
返回值：9
*/
  declare @location int
  declare @start int
  declare @next int
  declare @seed int

  set @str=ltrim(rtrim(@str))
  set @start=1
  set @next=1
  set @seed=len(@split)
  
  set @location=charindex(@split,@str)
  while @location<>0 and @index>@next
  begin
    set @start=@location+@seed
    set @location=charindex(@split,@str,@start)
    set @next=@next+1
  end
  if @location =0 select @location =len(@str)+1
 --这儿存在两种情况：1、字符串不存在分隔符号 2、字符串中存在分隔符号，跳出while循环后，@location为0，那默认为字符串后边有一个分隔符号。
  
  return substring(@str,@start,@location-@start)
end




GO
/****** Object:  UserDefinedFunction [dbo].[fun_getPY]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--set ANSI_NULLS ON
--set QUOTED_IDENTIFIER ON
 
-- =============================================
-- description:	提供中文首字母
-- Demo: select * from 表 where fun_getPY(字段) like N'%zgr%'
-- =============================================
alter  FUNCTION [dbo].[fun_getPY]
(
	@str NVARCHAR(4000)
)
RETURNS NVARCHAR(4000)
AS
BEGIN
	DECLARE @word NCHAR(1),@PY NVARCHAR(4000)
	SET @PY=''
	WHILE len(@str)>0
	BEGIN
		SET @word=left(@str,1)
		SET @PY=@PY+(CASE WHEN unicode(@word) BETWEEN 19968 AND 19968+20901
		THEN (SELECT TOP 1 PY FROM (
		SELECT 'A' AS PY,N'驁' AS word
		UNION ALL SELECT 'B',N'簿'
		UNION ALL SELECT 'C',N'錯'
		UNION ALL SELECT 'D',N'鵽'
		UNION ALL SELECT 'E',N'樲'
		UNION ALL SELECT 'F',N'鰒'
		UNION ALL SELECT 'G',N'腂'
		UNION ALL SELECT 'H',N'夻'
		UNION ALL SELECT 'J',N'攈'
		UNION ALL SELECT 'K',N'穒'
		UNION ALL SELECT 'L',N'鱳'
		UNION ALL SELECT 'M',N'旀'
		UNION ALL SELECT 'N',N'桛'
		UNION ALL SELECT 'O',N'漚'
		UNION ALL SELECT 'P',N'曝'
		UNION ALL SELECT 'Q',N'囕'
		UNION ALL SELECT 'R',N'鶸'
		UNION ALL SELECT 'S',N'蜶'
		UNION ALL SELECT 'T',N'籜'
		UNION ALL SELECT 'W',N'鶩'
		UNION ALL SELECT 'X',N'鑂'
		UNION ALL SELECT 'Y',N'韻'
		UNION ALL SELECT 'Z',N'咗'
		) T 
		WHERE word>=@word COLLATE Chinese_PRC_CS_AS_KS_WS 
		ORDER BY PY ASC) ELSE @word END)
		SET @str=right(@str,len(@str)-1)
	END
	RETURN @PY
END
GO
/****** Object:  UserDefinedFunction [dbo].[uf_get_icon]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
  
alter  FUNCTION  [dbo].[uf_get_icon]
(
	@icon_class varchar(40)
)
RETURNS VARCHAR(200)
AS
BEGIN
DECLARE @p VARCHAR(200)
SET  @p   = REPLACE( @icon_class,'icon-standard-','')
SET  @p   = REPLACE( @p,'icon-hamburg-','')
SET  @p   = REPLACE( @p,'icon-metro-','')
RETURN '/Scripts/03jeasyui/icons/icon-standard/16x16/' +@p+ '.png' 

END 


GO
/****** Object:  UserDefinedFunction [dbo].[uf_get_role_ids]    Script Date: 2018/4/3 6:38:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
alter  FUNCTION [dbo].[uf_get_role_ids] ( @user_id INT )
RETURNS NVARCHAR(1000)
AS
    BEGIN 
        DECLARE @result NVARCHAR(1000)
            
      
     
        SELECT  @result = STUFF(( SELECT DISTINCT
                                            ',' + CAST( role_id AS VARCHAR(10))
                                  FROM      ( SELECT  role_id
								  FROM dbo.vd_User_Role WHERE user_id = @user_id
                                            ) A
                                FOR
                                  XML PATH('')
                                ), 1, 1, '')

        RETURN ISNULL(@result,'') 

    END 
    
GO
