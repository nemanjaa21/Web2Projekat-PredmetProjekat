import React from "react";
import { Input, Box, Avatar, Button } from "@mui/material";

const ImageForm = (props) => {
  return (
    <Box>
      <Button onClick={props.avatarClickHandler}>
        <Avatar
          alt="picture"
          variant="square"
          src={props.image}
          sx={{ width: "200px", height: "200px" }}
        ></Avatar>
      </Button>
      <Box sx={{ display: "none" }}>
        <Input
          disabled={!props.disabled && true}
          type="file"
          ref={props.imageInput}
          onChange={props.uploadHandler}
          inputProps={{ accept: ".png, .jpg, .jpeg" }}
        />
      </Box>
    </Box>
  );
};

export default ImageForm;