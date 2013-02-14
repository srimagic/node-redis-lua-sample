do
	local result = function ()
		local avail_keys = redis.call('SUNION', 'KEY1', 'KEY2','KEY3')
		local redis_obj = {}
		local lua_obj_list = {}
		for key_ind = 1,table.getn(avail_keys)  do
			redis_obj = redis.call('hgetall',avail_keys[key_ind])
			local lua_obj = {}
			for fld_ind=1,table.getn(redis_obj),2 do
				local ind = redis_obj[fld_ind]
				lua_obj[ind] = redis_obj[fld_ind+1]
			end
			table.insert(lua_obj_list,table.tostring(lua_obj))
		end
		return lua_obj_list
	end

	function table.tostring( tbl )
	  local result, done = {}, {}
	  for k, v in ipairs( tbl ) do
	    table.insert( result, table.val_to_str( v ) )
	    done[ k ] = true
	  end
	  for k, v in pairs( tbl ) do
	    if not done[ k ] then
	      table.insert( result,
	        table.key_to_str( k ) .. "=" .. table.val_to_str( v ) )
	    end
	  end
	  return "{" .. table.concat( result, "," ) .. "}"
	end

	function table.key_to_str ( k )
	  if "string" == type( k ) and string.match( k, "^[_%a][_%a%d]*$" ) then
	    return k
	  else
	    return "[" .. table.val_to_str( k ) .. "]"
	  end
	end
	
	function table.val_to_str ( v )
	  if "string" == type( v ) then
	    v = string.gsub( v, "\n", "\\n" )
	    if string.match( string.gsub(v,"[^'\"]",""), '^"+$' ) then
	      return "'" .. v .. "'"
	    end
	    return '"' .. string.gsub(v,'"', '\\"' ) .. '"'
	  else
	    return "table" == type( v ) and table.tostring( v ) or
	      tostring( v )
	  end
	end
	
	return result()
end

